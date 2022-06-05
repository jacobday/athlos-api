const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");
const Facility = require("../models/Facility");
const { response } = require("../server");

beforeEach((done) => {
  mongoose.connect(
    process.env.MONGO_TEST_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

test("GET /facilities/", async () => {
  const facility = await Facility.create({
    facilityId: 1,
    facilityName: "Student Recreational Sports Center",
    facilityLocation: {
      place_id: "ChIJtxjOXrpmbIgRzbikOxbr4-0",
      city: "Bloomington",
      state: "IN",
      country: "USA",
      street: "Student Recreational Sports Center (SRSC), East Law Lane",
    },
    latitude: 39.1734,
    longitude: -86.5123139,
    facilitySports: "Soccer",
    facilityInformation: "Soccer Field A",
    availableNow: false,
    reservationPeriodStart: 13,
    reservationPeriodEnd: 18,
  });

  await supertest(app)
    .get("/facilities/")
    .expect(200)
    .then((response) => {
      // Check type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(1);

      // Check data
      expect(response.body[0].facilityName).toBe(facility.facilityName);
      expect(response.body[0].facilityLocation.city).toBe(
        facility.facilityLocation.city
      );
      expect(response.body[0].latitude).toBe(facility.latitude);
      expect(response.body[0].facilityInformation).toBe(
        facility.facilityInformation
      );
      expect(response.body[0].reservationPeriodEnd).toBe(
        facility.reservationPeriodEnd
      );
    });
});

test("POST /facilities/add", async () => {
  const data = {
    newFacilityData: {
      facilityName: "Student Recreational Sports Center",
      facilityLocation: {
        place_id: "ChIJtxjOXrpmbIgRzbikOxbr4-0",
        address:
          "Student Recreational Sports Center (SRSC), East Law Lane, Bloomington, IN, USA",
        locationPlaceholder:
          "Student Recreational Sports Center (SRSC), East Law Lane, Bloomington, IN, USA",
      },
      latitude: 39.1734,
      longitude: -86.5123139,
      facilitySport: "Soccer",
      facilityInfo: "Soccer Field A",
      reservationPeriodStart: 13,
      reservationPeriodEnd: 18,
    },
  };

  await supertest(app)
    .post("/facilities/add")
    .send(data)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.facility.facilityId).toBeTruthy();
      expect(response.body.facility.facilityName).toBe(
        data.newFacilityData.facilityName
      );
      expect(data.newFacilityData.facilityLocation.address).toContain(
        response.body.facility.facilityLocation.street
      );

      // Check data in the database
      const facility = await Facility.findOne({
        "facilityLocation.place_id":
          response.body.facility.facilityLocation.place_id,
      });
      expect(facility).toBeTruthy();
      expect(facility.facilityName).toBe(data.newFacilityData.facilityName);
      expect(data.newFacilityData.facilityLocation.address).toContain(
        facility.facilityLocation.street
      );
    });
});

test("DELETE /facilities/delete/:id", async () => {
  const facility = await Facility.create({
    facilityId: 1,
    facilityName: "Student Recreational Sports Center",
    facilityLocation: {
      place_id: "ChIJtxjOXrpmbIgRzbikOxbr4-0",
      city: "Bloomington",
      state: "IN",
      country: "USA",
      street: "Student Recreational Sports Center (SRSC), East Law Lane",
    },
    latitude: 39.1734,
    longitude: -86.5123139,
    facilitySports: "Soccer",
    facilityInformation: "Soccer Field A",
    availableNow: false,
    reservationPeriodStart: 13,
    reservationPeriodEnd: 18,
  });

  await supertest(app)
    .delete("/facilities/delete/" + facility.id)
    .expect(204);
  // .then(async () => {
  //   expect(await Facility.findOne({ _id: facility.id })).toBeFalsy();
  // });
});
