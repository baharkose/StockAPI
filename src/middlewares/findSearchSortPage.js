"use strict";

module.exports = (req, res, next) => {
  /* FILTERING & SEARCHING & SORTING & PAGINATION */

  // ### FILTERING ###
  // URL?filter[key1]=value1&filter[key2]=value2
  //- Bu satır, kullanıcının URL üzerinden gönderdiği filter parametrelerini alır. Eğer filter parametresi yoksa boş bir obje ({}) kullanılır. Bu, veritabanından veri çekilirken kullanılacak filtreleme kriterlerini belirler.

  const filter = req.query?.filter || {};
  // console.log(filter)

  // ### SEARCHING ###

  // URL?search[key1]=value1&search[key2]=value2
  // https://www.mongodb.com/docs/manual/reference/operator/query/regex/
  //-   İlk satır, URL'den search parametrelerini alır. Döngüde, her bir arama anahtarının değeri MongoDB'nin $regex operatörünü kullanarak güncellenir. $options: 'i' (case-insensitive) ile büyük/küçük harf duyarlılığı olmadan arama yapılır.
  const search = req.query?.search || {};
  // console.log(search)
  // const example = { title: { $regex: 'test', $options: 'i' } } // const example = { title: /test/ }
  // nasıl çalışıyor? Bunun yerine, search nesnesinde belirtilen her anahtar için (key), karşılık gelen değeri (search[key]) alır ve bu değeri bir MongoDB düzenli ifade sorgusuna ($regex) dönüştürür.
  //Örneğin, eğer search nesnesi { title: "hello", content: "world" } şeklindeyse, for (let key in search) döngüsü her bir anahtar-değer çiftini işler:
  // İlk döngüde, key "title" olur ve search["title"] değeri "hello" olarak alınır. Bu, search nesnesini { title: { $regex: "hello", $options: "i" } } şeklinde günceller. Bu, title alanında "hello" kelimesini büyük/küçük harfe duyarlı olmaksızın arar.
  // İkinci döngüde, key "content" olur ve search["content"] değeri "world" olarak alınır. Bu, search nesnesini { content: { $regex: "world", $options: "i" } } şeklinde günceller. Bu, content alanında "world" kelimesini büyük/küçük harfe duyarlı olmaksızın arar.
  // Yani, bu işlem tüm anahtar-değer çiftlerini alır ve her birini MongoDB'nin anlayacağı bir düzenli ifade sorgusuna dönüştürür. Düzenli ifade, belirtilen değerin metin içerisinde herhangi bir yerde, büyük/küçük harf farkı gözetmeksizin eşleşmesine izin verir. Bu, metin tabanlı aramalarda daha geniş ve esnek sonuçlar almanızı sağlar.
  for (let key in search) search[key] = { $regex: search[key], $options: "i" }; // i: case insensitive
  // console.log(search)

  // ### SORTING ###

  // URL?sort[key1]=asc&sort[key2]=desc
  // asc: A-Z - desc: Z-A
  //   URL'den sort parametrelerini alır. Bu parametreler MongoDB sorgularında kullanılarak verilerin nasıl sıralanacağını belirler. Örneğin, asc artan sıra, desc azalan sıra sağlar.
  const sort = req.query?.sort || {};
  // console.log(sort)

  // ### PAGINATION ###

  //   limit ve page değerleri alınır ve uygun dönüşümler yapılır. limit, sonuçların bir sayfada kaç tane listeleneceğini, page, hangi sayfada olunduğunu belirtir. skip, kaç kayıt atlanacağını hesaplar. page-1 hesabı yapılır çünkü sayfalama 0'dan başlar.

  // URL?page=3&limit=10
  //   limit sonuçların bir sayfada kaç tane sıralanacağıdır.
  //   page hangi sayfada olduğudur
  let limit = Number(req.query?.limit);
  // console.log(limit)
  limit = limit > 0 ? limit : Number(process.env.PAGE_SIZE || 20);
  // console.log(typeof limit, limit)

  let page = Number(req.query?.page);
  page = page > 0 ? page - 1 : 0; // Backend'de sayfa sayısı her zaman (page - 1)'dir.
  // console.log(typeof page, page)

  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : page * limit;
  // console.log(typeof skip, skip)

  /* FILTERING & SEARCHING & SORTING & PAGINATION */

  // Run for output:
  //   veritanabınından veri çekmek için

  res.getModelList = async (Model, customFilter = {}, populate = null) => {
    // Model.find() metodu, veritabanında belirli kriterlere göre döküman arar. { ...filter, ...search } ifadesi, filter ve search nesnelerinden alınan anahtar-değer çiftlerini sorgu nesnesi olarak birleştirir.
    return await Model.find({ ...filter, ...search, ...customFilter })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      //   ilişkili dokümanları sorguya dahil et
      .populate(populate);
  };

  // Details:
  res.getModelListDetails = async (Model, customFilter = {}) => {
    const data = await Model.find({ ...filter, ...search, ...customFilter });

    let details = {
      filter,
      search,
      sort,
      skip,
      limit,
      page,
      pages: {
        previous: page > 0 ? page : false,
        current: page + 1,
        next: page + 2,
        total: Math.ceil(data.length / limit),
      },
      totalRecords: data.length,
    };
    details.pages.next =
      details.pages.next > details.pages.total ? false : details.pages.next;
    if (details.totalRecords <= limit) details.pages = false;
    return details;
  };

  next();
};
