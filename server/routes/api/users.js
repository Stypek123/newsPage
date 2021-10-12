import express from 'express';
import mongodb from 'mongodb';
import bcrypt from 'bcrypt';

const router = express.Router();

// Get users
router.get('/', async (req, res) => {
    const users = await loadUsersCollection();
    res.send(await users.find({}).toArray());
});

// Get user
router.post('/login', async (req, res) => {
    const users = await loadUsersCollection();
    const user = users.find(user => user.username === req.body.username)
    // console.log(user);
    if(user == null) {
        return res.status(400).send('Nie można odnaleźć takiego użytkownika')
    }

    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success');
            console.log('udało się');
        } else {
            res.send('Not allowed');
            console.log('nie udało się');
        }
    } catch {
        res.status(500).send();
    }
    res.send(await users.find({  username: req.body.username, password: req.body.password} ).toArray());
    
});

// Add user
router.post('/:do', async (req, res) => {
    if(req.params.do == 'register') {
        try {
            // const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const users = await loadUsersCollection();
            await users.insertOne({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                isAdmin: false,
                createdAt: new Date()
            });
            res.status(201).send();
        } catch {
            res.status(500).send()
        }
    } else if (req.params.do == 'login') {
        const users = await loadUsersCollection();
        const user = users.find(user => user.username === req.body.username)
    // console.log(user);
        if(user == null) {
            return res.status(400).send('Nie można odnaleźć takiego użytkownika')
        }

        try {
            if(await bcrypt.compare(req.body.password, user.password)) {
                res.send('Success');
                console.log('udało się');
            } else {
                res.send('Not allowed');
                console.log('nie udało się');
            }
        } catch {
            res.status(500).send();
        }
    }
});


// Delete user
router.delete('/:id', async (req, res) => {
    const users = await loadUsersCollection();
    await users.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    res.status(200).send();

})

// Make user Admin
router.put('/:id', async (req, res) => {
    const users = await loadUsersCollection();
    await users.updateOne({
         _id: new mongodb.ObjectID(req.params.id) 
        }, {
            $set: {
                isAdmin: true
            }
        });
    res.status(200).send();
})


async function loadUsersCollection() {
    const client = await mongodb.MongoClient.connect("mongodb+srv://newsPage12:newsPage123@mojabaza.4tco6.mongodb.net/newsPage?retryWrites=true&w=majority", { useNewUrlParser: true });

    return client.db('newsPage').collection('users');
}


export default router