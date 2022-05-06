import db from '../config/dbConnect.js';

const authValidate = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const session = await db.collection('sessions').findOne({ token });
        if (!session) {
            return res.status(401).send('Unauthorized');
        }
        const user = await db
            .collection('users')
            .findOne({ _id: session.userId });
        if (!user) {
            return res.status(401).send('Unauthorized');
        }
    } catch (e) {
        return res.status(500).send(e);
    }
    next();
};

export default authValidate;
