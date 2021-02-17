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
});

const Booking = conn.define('booking', {
  id: {
    type: INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  startTime: {
    allowNull: false,
    type: DATE,
  },
  endTime: {
    allowNull: false,
    type: DATE,
  },
});

Member.belongsTo(Member, { as: 'sponsor' });
Member.hasMany(Member, { foreignKey: 'sponsorId' });
Booking.belongsTo(Member, { as: 'bookedBy' });
Booking.belongsTo(Facility, { as: 'facility' });
Member.hasMany(Booking, { foreignKey: 'bookedById' });
Facility.hasMany(Booking, { foreignKey: 'facilityId' });

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const [tennis, pool, restaurant, kacper, kevin, moe] = await Promise.all([
    Facility.create({ fac_name: 'tennis' }),
    Facility.create({ fac_name: 'pool' }),
    Facility.create({ fac_name: 'restaurant' }),
    Member.create({ first_name: 'kacper' }),
    Member.create({ first_name: 'kevin' }),
    Member.create({ first_name: 'moe' }),
  ]);

  const [one, two, three] = await Promise.all([
    Booking.create({
      id: 1,
      startTime: '2021-02-10 12:00:00',
      endTime: '2021-02-10 12:15:00',
    }),
    Booking.create({
      id: 2,
      startTime: '2021-02-10 1:00:00',
      endTime: '2021-02-10 1:15:00',
    }),
    Booking.create({
      id: 3,
      startTime: '2021-02-10 2:00:00',
      endTime: '2021-02-10 2:15:00',
    }),
  ]);

  moe.sponsorId = kevin.id;
  await moe.save();
  one.bookedById = kacper.id;
  one.facilityId = tennis.id;
  await one.save();
};

app.get('/', async (req, res) => {
  try {
    res.send(await Booking.findAll());
  } catch (error) {
    console.log(error);
  }
});

const init = async () => {
  try {
    await syncAndSeed();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

init();

// '2016-08-09 04:05:02'
