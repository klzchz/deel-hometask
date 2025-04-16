const { sequelize, Profile, Job, Contract } = require('../model');
const { Op } = require('sequelize');

const getUnpaidJobs = async (req, res) => {
  const profileId = req.profile.id;

  const jobs = await Job.findAll({
    where: {
      paid: {
        [Op.not]: true
      }
    },
    include: {
      model: Contract,
      where: {
        status: 'in_progress',
        [Op.or]: [
          { ClientId: profileId },
          { ContractorId: profileId }
        ]
      }
    }
  });

  res.json(jobs);
};

const payJob = async (req, res) => {
  const { job_id } = req.params;
  const clientId = req.profile.id;

  const job = await Job.findOne({
    where: { id: job_id },
    include: {
      model: Contract,
      where: { ClientId: clientId }
    }
  });

  if (!job) return res.status(404).json({ error: 'Job not found or unauthorized' });
  if (job.paid) return res.status(400).json({ error: 'Job already paid' });

  const client = await Profile.findOne({ where: { id: clientId } });
  const contractor = await Profile.findOne({ where: { id: job.Contract.ContractorId } });

  if (client.balance < job.price)
    return res.status(400).json({ error: 'Insufficient funds' });

  // transaction
  await sequelize.transaction(async (t) => {
    await client.decrement('balance', { by: job.price, transaction: t });
    await contractor.increment('balance', { by: job.price, transaction: t });
    await job.update({ paid: true, paymentDate: new Date() }, { transaction: t });
  });

  return res.json({ success: true });
};

module.exports = {
  getUnpaidJobs,
  payJob
};
