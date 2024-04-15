import { extractKeywordsFromText } from "./extractKeywordsFromText.js";
import { getOpportunitiesFromKeywords } from "./getOpportunitiesFromKeywords.js";

/**
 * @param {import(".").Opportunity} opportunities
 * @return {string}
 */
function format(opportunity) {
    const organizationName = opportunity.organizationBaseDtos
        .map((org) => org.organizationName)
        .join(" ");

    return `${opportunity.opportunityName} (${organizationName.trim()})\n` +
        `${opportunity.opportunityDescription ? opportunity.opportunityDescription.slice(0, 100) + "\n" : ""}` +
        (opportunity.opportunityTechReq + "\n" || "") +
        (opportunity.opportunityExtLink ? `More info: ${opportunity.opportunityExtLink}\n` : "");
}

/**
 * @param {string} text
 */
export async function getOpportunitiesInfoFromText(text) {
    const keywords = await extractKeywordsFromText(text);
    const opportunities = await getOpportunitiesFromKeywords(keywords);
    return opportunities.map(format);
}

function test() {
    const opportunities = [
        {
            "opportunityId": "ST485",
            "opportunityName": "Python vývojář/ka",
            "opportunityDescription": "Jsme ISECO a pro naše klienty realizujeme projekty dodávek, implementace a podpory řešení pro IT a informační bezpečnost postavené na špičkových systémech od předních výrobců (IBM, Rapid7, Ivanti) doplněná o in-house vyvinuté rozšíření. Jsme menší firma, sedíme ve vilce na pražském Chodově se zahrádkou a do našeho týmu by hledáme nového kolegu: \n\nPython vývojář/ka \n\nBavilo by tě: \n- Vyvíjet v Pythonu jak backendové, tak frontendové aplikace? \n- Pracovat přímo se zákaznickými bezpečnostními systémy? \n- Pracovat v mladém, menším týmu, a ne v korporaci? ",
            "opportunityKw": [
                "python",
                "kybernetická bezpěčnost",
                "linux",
                "information security",
                "developer",
                "databáze",
                "sql"
            ],
            "opportunitySignupDate": 1714471200000,
            "opportunityLocation": "Praha 4",
            "opportunityWage": "",
            "opportunityTechReq": "Tak pokud máš v malíku nebo ti alespoň není cizí:\t \n- Python s objektovým přístupem, multi-threadingem, ošetřováním chyb a logováním, frameworkem Flask, \n- verzovací systémy (GIT), \n- zkušenosti s linuxovými systémy, \n- základní orientace v sítích a síťových protokolech, \n- zkušenosti s SQL a návrhem databází (používáme hlavně PostgreSQL/SQLite), \n- zájem a základní orientaci v oblasti informační a IT bezpečnosti, \n- samostatný a odpovědný přístup a rád dotahuješ věci do konce. ",
            "opportunityFormReq": "",
            "opportunityOtherReq": "",
            "opportunityBenefit": "Můžeme ti nabídnout: \n- místo v našem vývojářském týmu, který vyvíjí doplňky pro systémy informační bezpečnosti, ale také větší projekty - samostatné aplikace, \n- práci na zajímavých bezpečnostních projektech pro TOP společnosti v ČR i ve světě, \n- prostor pro seberealizaci – oceňujeme aktivní přístup a nové nápady, \n- práci na vedlejší/hlavní pracovní poměr nebo dohodu o pracovní činnosti či spolupráci jako OSVČ, pro začátek v rozsahu 20 hodin týdně (flexibilně), \n- možnost se rozvíjet ve společnosti ISECO.CZ a vyzkoušet si práci na reálných projektech v prostředí zákazníka. \n\nKontakt: \nV případě zájmu prosím zašli své CV na email kariera@iseco.cz.",
            "opportunityJobStartDate": 1709204400000,
            "opportunityExtLink": "www.iseco.cz",
            "opportunityHomeOffice": "",
            "hidden": false,
            "opportunityType": 1,
            "jobTypes": [
                1,
                2,
                4
            ],
            "expertPreviews": [],
            "organizationBaseDtos": [
                {
                    "organizationId": 318509,
                    "organizationName": "ISECO.CZ ",
                    "organizationAbbrev": null,
                    "visible": true,
                    "active": false
                }
            ]
        },
        {
            "opportunityId": "ST141",
            "opportunityName": "Python vývojář do týmu Hlasového ovládání",
            "opportunityDescription": "Elektrické a elektronické systémy v automobilech hrají stále důležitější roli. Starají se o naše pohodlí i bezpečnost a bez jejich existence bychom si dnešní jízdu autem uměli jen stěží představit. Jejich vývoj a stálá inovace jsou zásadními faktory úspěchu každého výrobce automobilů. Jsme 100% členem skupiny Volkswagen a jsme důležitou součástí těchto aktivit.\n\nNedávno byla představená nová Škoda Octavia a Enyaq s řadou inovativních řešení v mnoha oblastech a se zcela novým Infotainmentem, který dominuje interiéru vozu. Infotainment je dnes prošpikovaný uživatelskými funkcemi – od klasického rádia, přes navigaci, telefonování, ovládání klimatizace až po možnost obsluhování mnoha multimediálních kanálů. Všechny tyto funkce lze ovládat hlasem.\n\nInformace o našem projektu:\n\nV našem projektu vyvíjíme a testujeme hlasové ovládání pro Škodu, Audi, VW a Porsche.\nPro vývoj hlasového ovládání do sebe zapadá hodně různých kompetencí od programátorů, UI a UX specialistů až po rodilé mluvčí. Díky tomu se nikdo nenudí a vzájemně se od sebe učíme.\nJsme mladý tým, který neustále roste a třeba hledáme právě Tebe\n\nhttps://www.youtube.com/watch?v=SOiSNVvWLSk\n\nZaujalo Tě téma hlasového ovládání a chtěl by ses o něm dozvědět více? Neváhej a určitě pošli CV, rádi Tě poznáme na osobní schůzce.\n\nPokud se k nám přidáš, očekávej:\n\nSuper tým plný mladých lidí\nNaučíš se spoustu věcí o hlasovém ovládání a uživatelském rozhraní\nBudeš vymýšlet, jak automatizovat a zlepšovat testování hlasového ovládání v Pythonu\nA spoustu dalšího.. :)\nCo od Tebe potřebujeme:\nSeniorní znalost Pythonu\nRest API, SQL, MongoDB výhodou\nAngličtinu na komunikativní úrovni (B2)\nSamostatnost a proaktivitu\n\nCo Ti dáme na oplátku?\n\nStart-up kulturu\nMožnost rychlého růstu\nSkvělou podporu od kolegů, kteří se postarají o to, abys co nejdřív naskočil/a do rozjetého vlaku\nMožnost se podílet a spolupracovat na vývoji hlasového ovládání\nHi-tech pracovní prostředí – prototypy, virtuální realita, inovace a další\nPracujeme 37,5 hodin týdně s pružnou pracovní dobou\nMůžeme si napracovat poskytnuté volno dopředu – flexi volno\nA pak taky dnes už standard: stravenky, 5 týdnů dovolené, Cafeteria, sick days, Multisportka a spoustu dalšího – mrkni na naše stránky\n\nTěšíme se na setkání s Tebou!",
            "opportunityKw": [
                "python",
                "hmi",
                "hlasové ovladání"
            ],
            "opportunitySignupDate": null,
            "opportunityLocation": "",
            "opportunityWage": "",
            "opportunityTechReq": "",
            "opportunityFormReq": "",
            "opportunityOtherReq": "",
            "opportunityBenefit": "",
            "opportunityJobStartDate": null,
            "opportunityExtLink": "",
            "opportunityHomeOffice": "",
            "hidden": false,
            "opportunityType": 1,
            "jobTypes": [
                1,
                2
            ],
            "expertPreviews": [],
            "organizationBaseDtos": [
                {
                    "organizationId": 221358,
                    "organizationName": "Digiteq Automotive",
                    "organizationAbbrev": null,
                    "visible": true,
                    "active": false
                }
            ]
        }
    ];

    opportunities.map(format).forEach((s) => console.log(s));
}

// test();