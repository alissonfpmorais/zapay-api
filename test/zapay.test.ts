import * as debtsJson from './mock/debts.json';
import { httpMock } from './mock/httpMock';
import { Zapay } from '../src';
import { getValueOrThrow } from '../src/lib/validation.lib';
import { ZapayDebt } from '../src/entity/debt.entity';
import { ZapayCompleteVehicle } from '../src/entity/vehicle.entity';

const baseUrl = process?.env?.ZAPAY_API_URL || '';
const username = process?.env?.ZAPAY_USERNAME || '';
const password = process?.env?.ZAPAY_PASSWORD || '';

describe('Testing Zapay Library', () => {
  let successZapay: Zapay;

  beforeAll((done) => {
    Zapay.newInstance(httpMock, baseUrl, username, password).then((zapay) => {
      successZapay = zapay;
      done();
    });
  });

  afterAll((done) => {
    successZapay.destroy().then(() => done());
  });

  it('Get debts when all inputs are valid', (done) => {
    successZapay.debts('MG', 'KYC2559', '00194483649').then((debts) => {
      const requiredDebts = debtsJson.debts?.map((debt) =>
        ZapayDebt.toDto(
          getValueOrThrow(
            ZapayDebt.fromDto({
              id: debt.id,
              amountInCents: Math.floor(debt.amount * 100),
              title: debt.title,
              debtType: debt.type,
              description: debt.description,
              dueDate: debt.due_date,
              distinct: debt.distinct,
            })
          )
        )
      );
      const requiredVehicle = ZapayCompleteVehicle.toDto(
        getValueOrThrow(
          ZapayCompleteVehicle.fromDto({
            renavam: debtsJson.vehicle?.renavam,
            plate: debtsJson.vehicle?.license_plate,
          })
        )
      );
      expect(debts).toEqual({
        protocol: debtsJson.protocol,
        debts: requiredDebts,
        vehicle: requiredVehicle,
      });
      done();
    });
  });
});
