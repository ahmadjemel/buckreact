const express=require('express');
const mongoose =require("mongoose")
const dotenv =require('dotenv')
const cors =require('cors')

dotenv.config()
const categorieRouter=require("./routes/categorie.route")
const articleRouter=require("./routes/article.route ")
const scategorieRouter=require("./routes/scategorie.route")
const paymentRouter = require( "./routes/payment.route.js")
const app = express();
const userRouter =require("./routes/user.route")
//BodyParser Middleware
app.use(express.static(__dirname + '/'));
app.use(express.json());
app.use(cors())
mongoose.set("strictQuery", false);
// Connexion à la base données
mongoose.connect(process.env.DATABASECLOUD,{
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(() => {console.log("Connexion à la base de données réussie");
}).catch(err => {
console.log('Impossible de se connecter à la base de données', err);
process.exit();
});
app.get("/",(req,res)=>{
res.send("Bienvenue");
});
app.use("/api/categories",categorieRouter)
app.use('/api/scategories', scategorieRouter);
app.use('/api/articles', articleRouter);
app.use('/api/productspage', articleRouter);

app.use('/api/payment', paymentRouter);
app.listen(process.env.PORT, () => {
console.log(`Server is listening on port ${process.env.PORT}`); });
app.use('/api/user', userRouter);

module.exports=app;