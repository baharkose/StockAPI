/* ------------------------------------------------------- 
                        USER MODEL
/* ------------------------------------------------------- */

// 1- öncelikle mongoose connectionunu sağla

const { Schema } = require("mongoose");
const { mongoose } = require("../configs/dbConnection");

// 2- Şemayı oluştur
const UserSchema = new Schema(
  {
    // tablolarımızdaki fieldlarımız ve özellikleri
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      // çok fazla erişim yapacağımız için kolay erişim sağlayabilmesi için index özelliğini ekledik.
      index: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    // ilk alan tablo isimleri, küçük harfle yazılır.
    collection: "users",
    timestamps: true,
  }
);

// 3- export et, ilk alan modül adı, ikinci alan ise neye göre model oluşturulacak.
module.exports = mongoose.model("User", UserSchema);
