import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { Parsed } from '../lib/validation.lib';

export interface State {
  kind: 'state';
  abbreviation: string;
  fullName: string;
  isAvailable: boolean;
  keys: {
    plate: boolean;
    renavam: boolean;
  };
}

const acreAbbreviation = 'AC';
const alagoasAbbreviation = 'AL';
const amapaAbbreviation = 'AP';
const amazonasAbbreviation = 'AM';
const bahiaAbbreviation = 'BA';
const cearaAbbreviation = 'CE';
const distritoFederalAbbreviation = 'DF';
const espiritoSantoAbbreviation = 'ES';
const goiasAbbreviation = 'GO';
const maranhaoAbbreviation = 'MA';
const matoGrossoAbbreviation = 'MT';
const matoGrossoDoSulAbbreviation = 'MS';
const minasGeraisAbbreviation = 'MG';
const paraAbbreviation = 'PA';
const paraibaAbbreviation = 'PB';
const paranaAbbreviation = 'PR';
const pernambucoAbbreviation = 'PE';
const piauiAbbreviation = 'PI';
const rioDeJaneiroAbbreviation = 'RJ';
const rioGrandeDoNorteAbbreviation = 'RN';
const rioGrandeDoSulAbbreviation = 'RS';
const rondoniaAbbreviation = 'RO';
const roraimaAbbreviation = 'RR';
const santaCatarinaAbbreviation = 'SC';
const saoPauloAbbreviation = 'SP';
const sergipeAbbreviation = 'SE';
const tocantinsAbbreviation = 'TO';

type StatesAbbreviation =
  | typeof acreAbbreviation
  | typeof alagoasAbbreviation
  | typeof amapaAbbreviation
  | typeof amazonasAbbreviation
  | typeof bahiaAbbreviation
  | typeof cearaAbbreviation
  | typeof distritoFederalAbbreviation
  | typeof espiritoSantoAbbreviation
  | typeof goiasAbbreviation
  | typeof maranhaoAbbreviation
  | typeof matoGrossoAbbreviation
  | typeof matoGrossoDoSulAbbreviation
  | typeof minasGeraisAbbreviation
  | typeof paraAbbreviation
  | typeof paraibaAbbreviation
  | typeof paranaAbbreviation
  | typeof pernambucoAbbreviation
  | typeof piauiAbbreviation
  | typeof rioDeJaneiroAbbreviation
  | typeof rioGrandeDoNorteAbbreviation
  | typeof rioGrandeDoSulAbbreviation
  | typeof rondoniaAbbreviation
  | typeof roraimaAbbreviation
  | typeof santaCatarinaAbbreviation
  | typeof saoPauloAbbreviation
  | typeof sergipeAbbreviation
  | typeof tocantinsAbbreviation;

const acre: State = {
  kind: 'state',
  abbreviation: acreAbbreviation,
  fullName: 'Acre',
  isAvailable: false,
  keys: { plate: true, renavam: true },
};
const alagoas: State = {
  kind: 'state',
  abbreviation: alagoasAbbreviation,
  fullName: 'Alagoas',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const amapa: State = {
  kind: 'state',
  abbreviation: amapaAbbreviation,
  fullName: 'Amapá',
  isAvailable: false,
  keys: { plate: true, renavam: true },
};
const amazonas: State = {
  kind: 'state',
  abbreviation: amazonasAbbreviation,
  fullName: 'Amazonas',
  isAvailable: false,
  keys: { plate: true, renavam: true },
};
const bahia: State = {
  kind: 'state',
  abbreviation: bahiaAbbreviation,
  fullName: 'Bahia',
  isAvailable: true,
  keys: { plate: false, renavam: true },
};
const ceara: State = {
  kind: 'state',
  abbreviation: cearaAbbreviation,
  fullName: 'Ceará',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const distritoFederal: State = {
  kind: 'state',
  abbreviation: distritoFederalAbbreviation,
  fullName: 'Distrito Federal',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const espiritoSanto: State = {
  kind: 'state',
  abbreviation: espiritoSantoAbbreviation,
  fullName: 'Espírito Santo',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const goias: State = {
  kind: 'state',
  abbreviation: goiasAbbreviation,
  fullName: 'Goiás',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const maranhao: State = {
  kind: 'state',
  abbreviation: maranhaoAbbreviation,
  fullName: 'Maranhão',
  isAvailable: false,
  keys: { plate: true, renavam: true },
};
const matoGrosso: State = {
  kind: 'state',
  abbreviation: matoGrossoAbbreviation,
  fullName: 'Mato Grosso',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const matoGrossoDoSul: State = {
  kind: 'state',
  abbreviation: matoGrossoDoSulAbbreviation,
  fullName: 'Mato Grosso do Sul',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const minasGerais: State = {
  kind: 'state',
  abbreviation: minasGeraisAbbreviation,
  fullName: 'Minas Gerais',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const para: State = {
  kind: 'state',
  abbreviation: paraAbbreviation,
  fullName: 'Pará',
  isAvailable: false,
  keys: { plate: true, renavam: true },
};
const paraiba: State = {
  kind: 'state',
  abbreviation: paraibaAbbreviation,
  fullName: 'Paraíba',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const parana: State = {
  kind: 'state',
  abbreviation: paranaAbbreviation,
  fullName: 'Paraná',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const pernambuco: State = {
  kind: 'state',
  abbreviation: pernambucoAbbreviation,
  fullName: 'Pernambuco',
  isAvailable: false,
  keys: { plate: true, renavam: true },
};
const piaui: State = {
  kind: 'state',
  abbreviation: piauiAbbreviation,
  fullName: 'Piauí',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const rioDeJaneiro: State = {
  kind: 'state',
  abbreviation: rioDeJaneiroAbbreviation,
  fullName: 'Rio de Janeiro',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const rioGrandeDoNorte: State = {
  kind: 'state',
  abbreviation: rioGrandeDoNorteAbbreviation,
  fullName: 'Rio Grande do Norte',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const rioGrandeDoSul: State = {
  kind: 'state',
  abbreviation: rioGrandeDoSulAbbreviation,
  fullName: 'Rio Grande do Sul',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const rondonia: State = {
  kind: 'state',
  abbreviation: rondoniaAbbreviation,
  fullName: 'Rondônia',
  isAvailable: false,
  keys: { plate: true, renavam: true },
};
const roraima: State = {
  kind: 'state',
  abbreviation: roraimaAbbreviation,
  fullName: 'Roraima',
  isAvailable: false,
  keys: { plate: true, renavam: true },
};
const santaCatarina: State = {
  kind: 'state',
  abbreviation: santaCatarinaAbbreviation,
  fullName: 'Santa Catarina',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const saoPaulo: State = {
  kind: 'state',
  abbreviation: saoPauloAbbreviation,
  fullName: 'São Paulo',
  isAvailable: true,
  keys: { plate: true, renavam: true },
};
const sergipe: State = {
  kind: 'state',
  abbreviation: sergipeAbbreviation,
  fullName: 'Sergipe',
  isAvailable: false,
  keys: { plate: true, renavam: true },
};
const tocantins: State = {
  kind: 'state',
  abbreviation: tocantinsAbbreviation,
  fullName: 'Tocantins',
  isAvailable: false,
  keys: { plate: true, renavam: true },
};

const statesMap: Map<StatesAbbreviation, State> = new Map();
statesMap.set(acreAbbreviation, acre);
statesMap.set(alagoasAbbreviation, alagoas);
statesMap.set(amapaAbbreviation, amapa);
statesMap.set(amazonasAbbreviation, amazonas);
statesMap.set(bahiaAbbreviation, bahia);
statesMap.set(cearaAbbreviation, ceara);
statesMap.set(distritoFederalAbbreviation, distritoFederal);
statesMap.set(espiritoSantoAbbreviation, espiritoSanto);
statesMap.set(goiasAbbreviation, goias);
statesMap.set(maranhaoAbbreviation, maranhao);
statesMap.set(matoGrossoAbbreviation, matoGrosso);
statesMap.set(matoGrossoDoSulAbbreviation, matoGrossoDoSul);
statesMap.set(minasGeraisAbbreviation, minasGerais);
statesMap.set(paraAbbreviation, para);
statesMap.set(paraibaAbbreviation, paraiba);
statesMap.set(paranaAbbreviation, parana);
statesMap.set(pernambucoAbbreviation, pernambuco);
statesMap.set(piauiAbbreviation, piaui);
statesMap.set(rioDeJaneiroAbbreviation, rioDeJaneiro);
statesMap.set(rioGrandeDoNorteAbbreviation, rioGrandeDoNorte);
statesMap.set(rioGrandeDoSulAbbreviation, rioGrandeDoSul);
statesMap.set(rondoniaAbbreviation, rondonia);
statesMap.set(roraimaAbbreviation, roraima);
statesMap.set(santaCatarinaAbbreviation, santaCatarina);
statesMap.set(saoPauloAbbreviation, saoPaulo);
statesMap.set(sergipeAbbreviation, sergipe);
statesMap.set(tocantinsAbbreviation, tocantins);

const statesList: Array<State> = [
  acre,
  alagoas,
  amapa,
  amazonas,
  bahia,
  ceara,
  distritoFederal,
  espiritoSanto,
  goias,
  maranhao,
  matoGrosso,
  matoGrossoDoSul,
  minasGerais,
  para,
  paraiba,
  parana,
  pernambuco,
  piaui,
  rioDeJaneiro,
  rioGrandeDoNorte,
  rioGrandeDoSul,
  rondonia,
  roraima,
  santaCatarina,
  saoPaulo,
  sergipe,
  tocantins,
];

const availableStates: Array<State> = statesList.filter((state) => state.isAvailable);

const abbreviations: Array<string> = availableStates.map((state) => state.abbreviation);

export class ZapayState {
  static readonly stateValidationSchema: Joi.StringSchema = Joi.string()
    .uppercase()
    .valid(...abbreviations);

  private static getOrDefault(abbreviation: StatesAbbreviation): State {
    return statesMap.get(abbreviation) || (statesMap.get(tocantinsAbbreviation) as State);
  }

  private static validate(maybeState: string): ValidationResult {
    return this.stateValidationSchema.validate(maybeState);
  }

  static fromRaw(maybeState: string): Parsed<State> {
    const { error, value } = this.validate(maybeState);
    return { error, value: this.getOrDefault(value) };
  }

  static toRaw(state: State): string {
    return state.abbreviation;
  }

  static availableStates(): Array<State> {
    return availableStates;
  }
}
