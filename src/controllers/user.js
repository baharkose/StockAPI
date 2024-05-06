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

    // buradaki user_id bizim context ya da redux ile sakladığımız user bilgisi, yine bize req ile gelebilir.
    const data = User.findOne(customFilter);
  },
  update: {},
  delete: {},
};
