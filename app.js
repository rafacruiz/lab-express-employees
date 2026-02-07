import express from "express";

import data from './data.json' with { type: 'json' };

const app = express();

app.use(express.json());

app.get('/api/employees', (req, res) => {
    const page = req.query?.page

    if (page) {
        const start = (2 * (page - 1));
        const end = start + 2;

        res.status(200).json(data.slice(start, end));
    } else {
        res.status(200).json(data);
    }
});


app.listen(3000, () => {
    console.log('Ready');
});