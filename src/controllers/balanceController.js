const { Profile, Job, Contract } = require('../model');
const { Op, fn, col, literal } = require('sequelize');

const depositBalance = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;
  const profile = req.profile;

  if (profile.id !== parseInt(userId)) {
    return res.status(403).json({ error: 'You can only deposit to your own account' });
  }

  if (profile.type !== 'client') {
    return res.status(400).json({ error: 'Only clients can receive deposits' });
  }

  // soma dos jobs não pagos (do cliente autenticado)
  const unpaidJobs = await Job.findAll({
    where: {
      paid: { [Op.not]: true }
    },
    include: {
      model: Contract,
      where: {
        ClientId: userId,
        status: 'in_progress'
      }
    }
  });

  const totalUnpaid = unpaidJobs.reduce((sum, job) => sum + parseFloat(job.price), 0);
  const maxAllowed = totalUnpaid * 0.25;

  if (amount > maxAllowed) {
    return res.status(400).json({
      error: 'Deposit exceeds 25% of unpaid jobs total',
      maxAllowed
    });
  }

  profile.balance += amount;
  await profile.save();

  return res.json({ success: true, newBalance: profile.balance });
};

module.exports = {
  depositBalance
};
