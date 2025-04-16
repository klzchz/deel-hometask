const { Job, Contract } = require('../model');
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

module.exports = {
  getUnpaidJobs
};
