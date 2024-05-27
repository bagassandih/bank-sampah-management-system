const services = require('../services/api/admin');

async function loginController(req, res) {
    // Destruct request 
    const { username, password } = req.body;
    try {
        const data = await services.adminLogin(username, password);
        res.status(200).json(data);
    } catch (error) {
        // Tangani kesalahan server
        console.error(error);
        res.status(error.status).json({ message: error.message });
    }
}

module.exports = {
    loginController
};
