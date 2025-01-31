import { Sequelize } from 'sequelize';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('temperature_history', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    thermostat_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'thermostats',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    temperature: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    target_temperature: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    mode: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    energy_usage: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  // Add indexes for efficient querying
  await queryInterface.addIndex('temperature_history', ['thermostat_id']);
  await queryInterface.addIndex('temperature_history', ['created_at']);
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('temperature_history');
};
