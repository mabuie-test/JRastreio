module.exports = (io) => {
  const r = require('express').Router();
  const Track = require('../models/Track');
  const Device = require('../models/Device');

  r.get('/', async (req,res)=>{
    const { imei, lat, lng } = req.query;
    const d = await Device.findOne({ imei });
    const t = await Track.create({
      device:d._id,latitude:lat,longitude:lng
    });
    io.to(`device:${imei}`).emit(`device:${imei}`, { lat, lng });
    res.status(201).json(t);
  });

  r.get('/history', async (req,res)=>{
    const list = await Track.find().sort({timestamp:-1}).limit(100);
    res.json(list);
  });

  return r;
};
