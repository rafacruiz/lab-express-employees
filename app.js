import express from "express";

import employees from './data.json' with { type: 'json' };

const app = express();

app.use(express.json());

function validateEmployee(employee) {
    const errors = [];

    const isEmpty = (value) => {
        if (value === null || value === undefined) return true;
        if (typeof value === "string") return value.trim() === "";
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === "object") return Object.keys(value).length === 0;
        
        return false;
    };

    const requiredKeys = [
        "name",
        "age",
        "phone",
        "privileges",
        "favorites",
        "finished",
        "badges",
        "points"
    ];

    requiredKeys.forEach((key) => {
        if (!(key in employee)) {
            errors.push(`Falta la clave '${key}'`);
        } else if (isEmpty(employee[key])) {
            errors.push(`'${key}' no puede estar vacío`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
}

app.get('/api/employees', (req, res) => {
    const { page, user } = req?.query;
    if (page) {
        const start = (2 * (page - 1));
        const end = start + 2;

        res.status(200).json(employees.slice(start, end));
    } else if (user) {

        const employeesPrivileges = employees.
            filter((employee) => employee.privileges.includes('user'));

        res.status(200).json(employeesPrivileges);
    } else {
        res.status(200).json(employees);
    }
});

app.get('/api/employees/oldest', (req, res) => {

    const oldest = employees.toSorted((a, b) => b.age - a.age)[0];

    res.status(200).json(oldest);
});

app.post('/api/employees', (req, res) => {
    const payload = req.body;

    const {isValid, errors} = validateEmployee(req.body);

    if (!isValid) {
        res.status(400).json({ 
            message: 'Error validations data', 
            errors
        });
        return;
    }

    const employee = {
        "name": payload.name,
        "age": payload.age,
        "phone": {
            "personal": payload.phone.personal,
            "work": payload.phone.work,
            "ext": payload.phone.ext
        },
        "privileges": payload.privileges,
        "favorites": {
            "artist": payload.favorites.artist,
            "food": payload.favorites.food
        },
        "finished": payload.finished,
        "badges": payload.badges,
        "points": [
            { "points": payload.points[0].points, 
                "bonus": payload.points[0].bonus 
            }]
    };

    employees.push(employee);

    res.status(201).json(employee);
});


app.listen(3000, () => {
    console.log('Ready');
});