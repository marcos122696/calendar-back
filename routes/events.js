//* host + /api/events
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validateFields } = require('../middlewares/validate-fields');
const { validarToken } = require('../middlewares/validate-token');
const { getEvents, 
    createEvent, 
    updateEvent, 
    deleteEvent
} = require('../controllers/events');

const router = Router();

router.use( validarToken );

router.get('/', getEvents);

router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom(isDate),
        check('end', 'Fecha de finalizacion es obligatorio').custom(isDate),
        validateFields 
    ],
    createEvent
 );

router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom(isDate),
        check('end', 'Fecha de finalizacion es obligatorio').custom(isDate),
        validateFields 
    ], 
    updateEvent);

router.delete('/:id', deleteEvent);

module.exports = router;