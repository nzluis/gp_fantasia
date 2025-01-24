const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect(
    `mongodb+srv://gp_user:${process.env.MONGO_PASS}@cluster0.cd0w6.mongodb.net/testing`
);

const riderSchema = new mongoose.Schema({
    fullName: String,
    nickname: String,
    dorsal: Number,
    team: String,
});
const Rider = mongoose.model('rider', riderSchema);

const circuitSchema = new mongoose.Schema({
    name: String,
    date: Date,
    due_date: Date,
    laps: Number,
    city: String,
    country: String,
    circuitID: String,
});
const Circuit = mongoose.model('circuit', circuitSchema);

const betSchema = new mongoose.Schema(
    {
        user: String,
        circuit: String,
        date: Date,
        moto3: Object,
        moto2: Object,
        motoGP: Object,
    },
    { versionKey: false }
);
const Bet = mongoose.model('bet', betSchema);

const resultSchema = new mongoose.Schema(
    {
        circuit: String,
        date: Date,
        moto3: Object,
        moto2: Object,
        motoGP: Object,
    },
    { versionKey: false }
);
const Result = mongoose.model('results', resultSchema);

app.get('/riders', async (req, res) => {
    try {
        const riders = await Rider.find({});
        res.json(riders);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pilotos' });
    }
});

app.get('/circuits', async (req, res) => {
    try {
        const circuits = await Circuit.find({});
        res.json(circuits);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pilotos' });
    }
});

app.get('/nextCircuit', async (req, res) => {
    try {
        const circuits = await Circuit.findOne({
            due_date: { $gte: new Date() },
        }).sort({ date: 1 });
        res.json(circuits);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los circuitos' });
    }
});

app.get('/bets', async (req, res) => {
    try {
        const bets = await Bet.find({});
        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pilotos' });
    }
});

app.post('/bets/create', async (req, res) => {
    try {
        const previousBet = await Bet.find({ circuit: req.body.circuit });
        if (req.body.forceSend) {
            const bet = await Bet.findOneAndUpdate(
                { circuit: req.body.circuit, user: req.body.user },
                { ...req.body, date: new Date() },
                { new: true }
            );
            res.json(bet);
            return;
        }
        if (previousBet.some((bet) => bet.user === req.body.user)) {
            res.status(400).json({
                error: true,
                message: 'User ya tiene apuesta para ese circuito',
            });
            return;
        }
        const bet = await Bet.create({ ...req.body, date: new Date() });
        res.json(bet);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la apuesta' });
    }
});

app.get('/results', async (req, res) => {
    try {
        const results = await Result.find({});
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pilotos' });
    }
});

app.post('/results/create', async (req, res) => {
    console.log(req.body);
    try {
        const previousResult = await Result.find({ circuit: req.body.circuit });
        if (
            previousResult.some((result) => result.circuit === req.body.circuit)
        ) {
            res.status(400).json({
                error: true,
                message: 'El circuito ya tiene resultado asignado',
            });
            return;
        }
        const result = await Result.create({ ...req.body, date: new Date() });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el resultado' });
    }
});

app.put('/riders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedrider = await Rider.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        res.json(updatedrider);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el piloto' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
