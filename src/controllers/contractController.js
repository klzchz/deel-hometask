const { Contract } = require('../model');
const { Op } = require('sequelize');

const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const profileId = req.profile.id;

    const contract = await Contract.findOne({
      where: {
        id,
        [Op.or]: [
          { ClientId: profileId },
          { ContractorId: profileId }
        ]
      }
    });

    if (!contract) return res.status(404).end();
    res.json(contract);
  } catch (err) {
    console.error('error to find contract', err);
    res.status(400).json({ error: 'Bad Request', details: err.message });
  }
};

const getUserContracts = async (req, res) => {
  const profileId = req.profile.id;

  const contracts = await Contract.findAll({
    where: {
      status: { [Op.not]: 'terminated' },
      [Op.or]: [
        { ClientId: profileId },
        { ContractorId: profileId }
      ]
    }
  });

  res.json(contracts);
};

module.exports = {
  getContractById,
  getUserContracts
};
// This code defines the contract controller for handling contract-related requests.