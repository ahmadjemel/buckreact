const express = require('express');
const router = express.Router();
const Categorie=require("../models/categorie");
const { authorizeRoles } = require('../middleware/authorizeRoles');
const { verifyToken } = require('../middleware/verify-token');

// créer un nouvelle catégorie
router.post('/',verifyToken,authorizeRoles("admin","user","visiteur"), async (req, res) => {
    const { nomcategorie, imagecategorie} = req.body;
    const newCategorie = new Categorie({nomcategorie:nomcategorie,
    imagecategorie:imagecategorie})
    try {
        await newCategorie.save();
        res.status(200).json(newCategorie );
        } catch (error) {
        res.status(404).json({ message: error.message });
        }  });
     
// afficher la liste des categories.
router.get('/',verifyToken,authorizeRoles("visiteur"), async (req, res )=> { 
    try {
    const cat = await Categorie.find({}, null, {sort: {'_id': -1}})
    res.status(200).json(cat);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
     // chercher une catégorie
router.get('/:categorieId',async(req, res)=>{
    try {
    const cat = await Categorie.findById(req.params.categorieId);
    res.status(200).json(cat);
} catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
    // modifier une catégorie
router.put('/:categorieId', async (req, res)=> {
    try {
    const cat1 = await Categorie.findByIdAndUpdate(
    req.params.categorieId,
    { $set: req.body },
    { new: true }
    );
    res.status(200).json(cat1);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
// Supprimer une catégorie
router.delete('/:categorieId', async (req, res)=> {
    const id = req.params.categorieId;
    await Categorie.findByIdAndDelete(id);
    res.json({ message: "categorie deleted successfully." });
    });    
        module.exports = router;