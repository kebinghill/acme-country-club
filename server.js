const { STRING, UUID, UUIDV4, DATE, Sequelize, INTEGER } = require('sequelize');
const express = require('express');

const app = express();

const conn = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/acme_country_club'
);

const Facility = conn.define('facility', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  fac_name: {
    type: STRING(100),
    allowNull: false,
    unique: true,
  },
});

const Member = conn.define('member', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  first_name: {
    type: STRING(20),
    allowNull: false,
    unique: true,
  },

  sponsorId: {
    type: UUID,
  },
});

const Booking = conn.define('booking', {
  id: {
    type: INTEGER,
    primaryKey: true,
  },
  startTime: {
    allowNull: false,
    type: DATE,
  },
  endTime: {
    allowNull: false,
    type: DATE,
  },
  bookedById: {
    type: UUID,
  },
  facilityId: {
    type: UUID,
  },
});

Member.belongsTo(Member, { as: 'sponsor' });
Member.hasMany(Member, { foreignKey: 'sponsorId' });

const init = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

init();
