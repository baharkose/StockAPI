"use strict";

/* -------------------------------------------------------
    NODEJS EXPRESS | STOCK API
------------------------------------------------------- */

// USER CONTROLLER

// 1- öncelikle modeli import et

const User = require("../models/user");
// burada user create olduğunda güvenlikli api oluşturabilmek için bir token oluşturmamız gerekiyor. Aynı zamanda password oluşturulduğunda encyript işleminin yapılması gerekiyor. o nedenle tokenModelimizi ve passwordEncrypt dosyamızı çağırıyoruz. Tokenı şifrelemek için passwordEncrypt'i kullanıyoruz.

const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            // apiyi users adında gruplandır
            #swagger.summary = "List Users"
            // apinin ne yaptığını kısaca açıkla
            #swagger.description = `
                You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
                <ul> Examples:
                // hangi kullanıcının dönüleceğini sınırla
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    // kullanıcıları belirtilen şekilde arayabilme
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    // kullanıcıları sırala
                    <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                    // sayfa başına gösterilen sonuç sayısını kontrol et ve sonuçlarının hangi sayfasının görüntüleneceği
                    <li>URL/?<b>limit=10&page=1</b></li>
                </ul>
            `
        */

    // kullanıcı sadece kendi kayıtlarını görebilir. Bunun için customFilter hazırlıyoruz.

    // Eğer kişi admin değilse sadece kendini görüntüleyebilsin. Diğer kullanıcıları görüntülemesin

    // * buradaki req.user -> authentication middleware'inden gelir. req.user bizim tokenDatamız, tokenData'ya populate ile useridyi aldık.
    const customFilter = req.user?.isAdmin ? {} : { _id: req.user._id };
    const data = await getModelList(User, customFilter);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User, customFilters),
      data,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = ["Create User"]
      #swagger.parameters['body] = {
        in:"body",
        required:true,
        schema:{
          "username":"test",
          "password":"Aa*123456",
          "email":"test@mail.com",
          "firstName":"test",
          "lastName":"test",
        }
      }
    
    */

    // isAdmin ve isStaff req.body'den ne gelirse gelsin false olsun

    req.body.isStaff = false;
    req.body.isAdmin = false;

    const data = await User.create(req.body);
    res.status(201).send({
      error: false,
      data,
    });

    // AUTO LOGIN -> dikkat bunu create içerisinde yapıyoruz.
    //  kullanıcı register işlemini yaptığında otomatik olarak login olması gerekiyor bu nedenle de burada bir token oluşturmamız gerekiyor. O nedenle tokenModeli çağırıyoruz.

    const tokenData = await Token.create({
      // tokenın unique olaibilmesi için  ve hangi kullanıcıya hashlemme işlemi yapılacağını belirlemek için kullanıcı idyi alıyoruz ve şifreleme için yine id şuanı refrerans alıyoruz ve tokenımızı hashliyoruz.
      userId: data._id,
      token: passwordEncrypt(data._id + Date.now()),
    });

    res.status(201).send({
      error: false,
      token: tokenData.token,
      data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Get Single User"
    */
    // isAdmin dışındakiler başkalarının bilgilerini görmesin
    const customFilter = req.user?.isAdmin
      ? { _id: req.params._id }
      : { _id: req.user._id };

    // buradaki req.user bizim authentication middlewarei kullarak yazdığımız tokenla birlikte gelen req.userdır.
    const data = await User.findOne(customFilter);
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary= "Update User"
      #swagger.paramters['body'] = {
        in: "body",
        required: true,
        schema: {
          "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "firstName": "test",
                    "lastName": "test",
        }
      }
    */

    //! create'te kullanıcı ne yaparsa yapsın isAdmin ve isStaff false olsun demiştik burada ise hiçbir şekilde müdahale edilmesin false dahi değişikliği yapılamasın istiyoruz. isStaff kendini ya da isAdmin kendini false'yapamaz.
    if (req.user?.isAdmin) {
      delete req.body.isAdmin;
      delete req.body.isStaff;
    }

    // eğer kullanıcı admin ise parametredeki idye göre kişiyi güncelleyebilir. Ancak admin değilse sadece kendisini güncelleyebilir.

    // SADECE KENDİ KAYDINI GÜNCELLEYEBİLİR
    const customFilter = req.user?.isAdmin
      ? { _id: req.params.id }
      : { _id: req.user.id };

    const data = await User.updateOne(customFilter, req.body, {
      runValidators: true,
      // runValidators: true seçeneği, bu tür bir güncelleme işlemi sırasında da şema doğrulayıcılarının aktif olmasını sağlar. Böylece veritabanınıza yanlışlıkla şemanıza uygun olmayan veri girilmesinin önüne geçilmiş olur.
    });
    res.status(202).send({
      error: false,
      data,
      // !gelen yeni datayı görüntüle
      new: await User.findOne(customFilter),
    });
  },
  delete: async (req, res) => {
    /*
      #swagger.tags=["Users"]
      #swagger.summary="Delete User"
    */

    // Kimse kendisini silemez. Burada silme işlemini yalnızca admin yapabilir. Ancak isAdmin kontrolünü biz permissionlarla da yapabiliriz. O nedenle ekstradan burada yapmamıza gerek kalmadı.
    if (req.user._id != req.params.id) {
      const data = await User.deleteOne({ _id: req.params.id });

      res
        .status(data.deletedCount ? 204 : 404)
        .send({ error: !data.deletedCount, data });
    } else {
      // Admin de kendisini silemez.
      res.errorStatusCode = 403;
      throw new Error("You can not remove yourself");
    }
  },
};
