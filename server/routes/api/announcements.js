import express from 'express';
import mongodb from 'mongodb';

const router = express.Router();

// Get Announcements
router.get('/:do/:category', async (req, res) => {
    //get all accepted posts 
    if(req.params.do === 'accepted' && req.params.category === 'all') {
        const announcements = await loadAnnouncementsCollection();
        res.send(await announcements.find( { isAccepted: {$eq: true} } ).toArray());
        
    } else if(req.params.do === 'accepted' && req.params.category === 'cars') {
        // get all accepted posts from category
        const announcements = await loadAnnouncementsCollection();
        res.send(await announcements.find( { $and: [ { isAccepted: {$eq: true} }, {category: 'cars'} ] } ).toArray());

    }else if(req.params.do === 'accepted' && req.params.category === 'clothes') {
        // get all accepted posts from category
        const announcements = await loadAnnouncementsCollection();
        res.send(await announcements.find( { $and: [ { isAccepted: {$eq: true} }, {category: 'clothes'} ] } ).toArray());

    }else if(req.params.do === 'accepted' && req.params.category === 'houses') {
        // get all accepted posts from category
        const announcements = await loadAnnouncementsCollection();
        res.send(await announcements.find( { $and: [ { isAccepted: {$eq: true} }, {category: 'houses'} ] } ).toArray());

    }else if(req.params.do === 'accepted' && req.params.category === 'services') {
        // get all accepted posts from category
        const announcements = await loadAnnouncementsCollection();
        res.send(await announcements.find( { $and: [ { isAccepted: {$eq: true} }, {category: 'services'} ] } ).toArray());

    } else if(req.params.do == 'notaccepted') {

        const announcements = await loadAnnouncementsCollection();
        res.send(await announcements.find( { isAccepted: {$eq: false} } ).toArray());
    }
});


// Add Announcement
router.post('/', async (req, res) => {
    const announcements = await loadAnnouncementsCollection();
    await announcements.insertOne({
        img: req.body.img,
        title: req.body.title,
        text: req.body.text,
        user: req.body.user,
        category: req.body.category,
        createdAt: new Date(),
        isAccepted: false
    });
    res.status(201).send();
});

// Accept (update) Announcement
router.put('/:id', async (req, res) => {
    const announcements = await loadAnnouncementsCollection();
    await announcements.updateOne({
         _id: new mongodb.ObjectID(req.params.id) 
        }, {
            $set: {
                isAccepted: true
            }
        });
    res.status(200).send();
})


// Delete Announcement
router.delete('/:id', async (req, res) => {
    const announcements = await loadAnnouncementsCollection();
    await announcements.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    res.status(200).send();

})

async function loadAnnouncementsCollection() {
    const client = await mongodb.MongoClient.connect("mongodb+srv://newsPage12:newsPage123@mojabaza.4tco6.mongodb.net/newsPage?retryWrites=true&w=majority", { useNewUrlParser: true });

    return client.db('newsPage').collection('announcements');
}


export default router