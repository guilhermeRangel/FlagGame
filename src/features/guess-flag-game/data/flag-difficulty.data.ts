import type { GuessFlagDifficulty } from '@/features/guess-flag-game/types';

export const EXPECTED_GUESS_FLAG_CLASSIFICATION_COUNT = 262;

/**
 * Curadoria editorial de familiaridade para o público brasileiro.
 *
 * Cada ID do catálogo compartilhado deve aparecer exatamente uma vez. A
 * dificuldade representa o reconhecimento esperado da bandeira, e não uma
 * classificação geográfica, econômica ou política do país.
 */
export const FLAG_IDS_BY_DIFFICULTY: Readonly<Record<GuessFlagDifficulty, readonly string[]>> = {
  easy: [
    'ar', // Argentina
    'au', // Austrália
    'be', // Bélgica
    'br', // Brasil
    'ca', // Canadá
    'ch', // Suíça
    'cl', // Chile
    'cn', // China
    'co', // Colômbia
    'cu', // Cuba
    'de', // Alemanha
    'dk', // Dinamarca
    'eg', // Egito
    'es', // Espanha
    'fr', // França
    'gb', // Reino Unido
    'gb-eng', // Inglaterra
    'gr', // Grécia
    'hr', // Croácia
    'ie', // Irlanda
    'il', // Israel
    'in', // Índia
    'it', // Itália
    'jm', // Jamaica
    'jp', // Japão
    'kr', // Coreia do Sul
    'ma', // Marrocos
    'mx', // México
    'ng', // Nigéria
    'nl', // Países Baixos
    'no', // Noruega
    'nz', // Nova Zelândia
    'pe', // Peru
    'pl', // Polônia
    'pt', // Portugal
    'ru', // Rússia
    'sa', // Arábia Saudita
    'se', // Suécia
    'tr', // Turquia
    'ua', // Ucrânia
    'us', // Estados Unidos
    'uy', // Uruguai
    'za', // África do Sul
  ],
  medium: [
    'ae', // Emirados Árabes Unidos
    'af', // Afeganistão
    'am', // Armênia
    'ao', // Angola
    'at', // Áustria
    'az', // Azerbaijão
    'ba', // Bósnia e Herzegovina
    'bd', // Bangladesh
    'bg', // Bulgária
    'bo', // Bolívia
    'bs', // Bahamas
    'by', // Bielorrússia
    'ci', // Costa do Marfim
    'cm', // Camarões
    'cr', // Costa Rica
    'cv', // Cabo Verde
    'cy', // Chipre
    'cz', // Tchéquia
    'do', // República Dominicana
    'dz', // Argélia
    'ec', // Equador
    'ee', // Estônia
    'et', // Etiópia
    'eu', // União Europeia
    'fi', // Finlândia
    'fj', // Fiji
    'gb-sct', // Escócia
    'gb-wls', // País de Gales
    'ge', // Geórgia
    'gh', // Gana
    'gt', // Guatemala
    'hn', // Honduras
    'ht', // Haiti
    'hu', // Hungria
    'id', // Indonésia
    'iq', // Iraque
    'ir', // Irã
    'is', // Islândia
    'ke', // Quênia
    'kh', // Camboja
    'kp', // Coreia do Norte
    'kw', // Kuwait
    'kz', // Cazaquistão
    'lb', // Líbano
    'lk', // Sri Lanka
    'lt', // Lituânia
    'lu', // Luxemburgo
    'lv', // Letônia
    'ly', // Líbia
    'md', // Moldávia
    'me', // Montenegro
    'mg', // Madagascar
    'mk', // Macedônia do Norte
    'mm', // Mianmar (Birmânia)
    'mn', // Mongólia
    'mt', // Malta
    'mv', // Maldivas
    'my', // Malásia
    'mz', // Moçambique
    'ni', // Nicarágua
    'np', // Nepal
    'pa', // Panamá
    'ph', // Filipinas
    'pk', // Paquistão
    'pr', // Porto Rico
    'ps', // Territórios palestinos
    'py', // Paraguai
    'qa', // Catar
    'ro', // Romênia
    'rs', // Sérvia
    'sd', // Sudão
    'sg', // Singapura
    'si', // Eslovênia
    'sk', // Eslováquia
    'sn', // Senegal
    'so', // Somália
    'sy', // Síria
    'th', // Tailândia
    'tn', // Tunísia
    'tt', // Trinidad e Tobago
    'tw', // Taiwan
    'tz', // Tanzânia
    'ug', // Uganda
    'un', // Nações Unidas
    'va', // Cidade do Vaticano
    've', // Venezuela
    'vn', // Vietnã
    'xk', // Kosovo
    'ye', // Iêmen
    'zw', // Zimbábue
  ],
  hard: [
    'ad', // Andorra
    'ag', // Antígua e Barbuda
    'al', // Albânia
    'bb', // Barbados
    'bf', // Burquina Faso
    'bh', // Barein
    'bi', // Burundi
    'bj', // Benin
    'bn', // Brunei
    'bt', // Butão
    'bw', // Botsuana
    'bz', // Belize
    'cd', // Congo - Kinshasa
    'cf', // República Centro-Africana
    'cg', // República do Congo
    'dj', // Djibuti
    'dm', // Dominica
    'er', // Eritreia
    'fm', // Micronésia
    'ga', // Gabão
    'gd', // Granada
    'gm', // Gâmbia
    'gn', // Guiné
    'gq', // Guiné Equatorial
    'gw', // Guiné-Bissau
    'gy', // Guiana
    'jo', // Jordânia
    'kg', // Quirguistão
    'ki', // Quiribati
    'km', // Comores
    'kn', // São Cristóvão e Névis
    'la', // Laos
    'lc', // Santa Lúcia
    'li', // Liechtenstein
    'lr', // Libéria
    'ls', // Lesoto
    'mc', // Mônaco
    'mh', // Ilhas Marshall
    'ml', // Mali
    'mr', // Mauritânia
    'mu', // Maurício
    'mw', // Malaui
    'na', // Namíbia
    'ne', // Níger
    'nr', // Nauru
    'om', // Omã
    'pg', // Papua-Nova Guiné
    'pw', // Palau
    'rw', // Ruanda
    'sb', // Ilhas Salomão
    'sc', // Seicheles
    'sl', // Serra Leoa
    'sm', // San Marino
    'sr', // Suriname
    'ss', // Sudão do Sul
    'st', // São Tomé e Príncipe
    'sv', // El Salvador
    'sz', // Essuatíni
    'td', // Chade
    'tg', // Togo
    'tj', // Tadjiquistão
    'tl', // Timor-Leste
    'tm', // Turcomenistão
    'to', // Tonga
    'tv', // Tuvalu
    'uz', // Uzbequistão
    'vc', // São Vicente e Granadinas
    'vu', // Vanuatu
    'ws', // Samoa
    'zm', // Zâmbia
  ],
  expert: [
    'ac', // Ilha de Ascensão
    'ai', // Anguila
    'aq', // Antártida
    'as', // Samoa Americana
    'aw', // Aruba
    'ax', // Ilhas Aland
    'bl', // São Bartolomeu
    'bm', // Bermudas
    'bq', // Países Baixos Caribenhos
    'bv', // Ilha Bouvet
    'cc', // Ilhas Cocos (Keeling)
    'ck', // Ilhas Cook
    'cp', // Ilha de Clipperton
    'cq', // Sark
    'cw', // Curaçao
    'cx', // Ilha Christmas
    'dg', // Diego Garcia
    'ea', // Ceuta e Melilla
    'eh', // Saara Ocidental
    'fk', // Ilhas Malvinas
    'fo', // Ilhas Faroé
    'gf', // Guiana Francesa
    'gg', // Guernsey
    'gi', // Gibraltar
    'gl', // Groenlândia
    'gp', // Guadalupe
    'gs', // Ilhas Geórgia do Sul e Sandwich do Sul
    'gu', // Guam
    'hk', // Hong Kong, RAE da China
    'hm', // Ilhas Heard e McDonald
    'ic', // Ilhas Canárias
    'im', // Ilha de Man
    'io', // Território Britânico do Oceano Índico
    'je', // Jersey
    'ky', // Ilhas Cayman
    'mf', // São Martinho
    'mo', // Macau, RAE da China
    'mp', // Ilhas Marianas do Norte
    'mq', // Martinica
    'ms', // Montserrat
    'nc', // Nova Caledônia
    'nf', // Ilha Norfolk
    'nu', // Niue
    'pf', // Polinésia Francesa
    'pm', // São Pedro e Miquelão
    'pn', // Ilhas Pitcairn
    're', // Reunião
    'sh', // Santa Helena
    'sj', // Svalbard e Jan Mayen
    'sx', // Sint Maarten
    'ta', // Tristão da Cunha
    'tc', // Ilhas Turcas e Caicos
    'tf', // Territórios Franceses do Sul
    'tk', // Tokelau
    'um', // Ilhas Menores Distantes dos EUA
    'vg', // Ilhas Virgens Britânicas
    'vi', // Ilhas Virgens Americanas
    'wf', // Wallis e Futuna
    'yt', // Mayotte
  ],
};
