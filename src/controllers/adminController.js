const { Job, Contract, Profile } = require('../model');
const { Op, fn, col } = require('sequelize');

const getBestProfession = async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: 'start and end dates are required' });
  }

  const result = await Job.findAll({
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [new Date(start), new Date(end)]
      }
    },
    include: {
      model: Contract,
      include: {
        model: Profile,
        as: 'Contractor'
      }
    },
    attributes: [],
    group: ['Contract.Contractor.profession'],
    order: [[fn('sum', col('price')), 'DESC']],
    limit: 1,
    raw: true,
    nest: true,
  });

  if (!result.length) return res.status(404).json({ message: 'No data found' });

  res.json({
    profession: result[0].Contract.Contractor.profession,
    totalEarned: parseFloat(result[0]['sum(price)'])
  });
};

const getBestClients = async (req, res) => {
    const { start, end, limit = 2 } = req.query;
  
    if (!start || !end) {
      return res.status(400).json({ error: 'start and end dates are required' });
    }
  
    const result = await Job.findAll({
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [new Date(start), new Date(end)]
        }
      },
      include: {
        model: Contract,
        include: {
          model: Profile,
          as: 'Client',
          attributes: ['id', 'firstName', 'lastName']
        }
      },
      attributes: [],
      group: ['Contract.Client.id'],
      order: [[fn('sum', col('price')), 'DESC']],
      limit: parseInt(limit),
      raw: true,
      nest: true
    });
  
    const clients = result.map(r => ({
      id: r.Contract.Client.id,
      fullName: `${r.Contract.Client.firstName} ${r.Contract.Client.lastName}`,
      paid: parseFloat(r['sum(price)'])
    }));
  
    res.json(clients);
  };
  
  module.exports = {
    getBestProfession,
    getBestClients
  };
  

