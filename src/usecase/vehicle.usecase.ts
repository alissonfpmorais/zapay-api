import { Token } from '../entity/token.entity';
import { Plate } from '../entity/plate.entity';
import { SimpleVehicle } from '../entity/vehicle.entity';

export interface VehicleResponse {
  vehicle: SimpleVehicle;
}

export interface IVehicleService {
  vehicle(token: Token, plate: Plate): Promise<VehicleResponse>;
}

export class VehicleUseCase {
  private readonly _vehicleService: IVehicleService;
  private readonly _getToken: () => Token;

  constructor(vehicleService: IVehicleService, getToken: () => Token) {
    this._vehicleService = vehicleService;
    this._getToken = getToken;
  }

  async vehicle(plate: Plate): Promise<VehicleResponse> {
    const token = this._getToken();
    return this._vehicleService.vehicle(token, plate);
  }
}
