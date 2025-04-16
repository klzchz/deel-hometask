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

module.exports = {
  getBestProfession
};
