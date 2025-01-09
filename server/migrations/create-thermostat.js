export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Thermostats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      currentTemperature: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 20.0
      },
      targetTemperature: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 22.0
      },
      mode: {
        type: Sequelize.ENUM('heat', 'cool', 'off'),
        allowNull: false,
        defaultValue: 'off'
      },
      zone: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Main Zone'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      schedule: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  
    // Add indexes
    await queryInterface.addIndex('Thermostats', ['userId']);
    await queryInterface.addIndex('Thermostats', ['zone']);
  }
  
  export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Thermostats');
  }