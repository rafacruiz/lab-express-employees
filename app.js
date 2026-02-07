import express from "express";

import employees from './data.json' with { type: 'json' };

const app = express();

app.use(express.json());

app.get('/api/employees', (req, res) => {
    const page = req.query?.page

    if (page) {
        const start = (2 * (page - 1));
        const end = start + 2;

        res.status(200).json(employees.slice(start, end));
    } else {
        res.status(200).json(employees);
    }
});

app.get('/api/employees/oldest', (req, res) => {

    const oldest = employees.toSorted((a, b) => b.age - a.age)[0];

    res.status(200).json(oldest);
});


app.listen(3000, () => {
    console.log('Ready');
});