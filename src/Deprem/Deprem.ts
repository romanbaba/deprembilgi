export class Deprem {
    static depremler: DepremListe[] = [];
  
    static depremYenile = async () => {
      const depremListe = ((await (await fetch("https://deprem.afad.gov.tr/last-earthquakes.html")).text()).match(/<tr>.+<\/tr>/) || [""])[0]
        .split("</tr>")
        .slice(1)
        .map((deprem) => {
          const yeniYazı = deprem.replace("<tr>", "").replace("</thead>", "").replace("<tbody>", "");
          return yeniYazı
            .split("</td>")
            .map((yazı) => yazı.replace("<td>", ""))
            .slice(0, -1);
        }).filter((deprem) => deprem[0]) as DepremListe[];
  
      this.depremler = depremListe;
    };
  
    static depremÇevir = (): DepremHarita[] => 
      this.depremler.map((verilen) => {
        return {
          tarih: verilen[0],
          enlem: verilen[1],
          boylam: verilen[2],
          derinlik: verilen[3],
          tip: verilen[4],
          büyüklük: verilen[5],
          yer: verilen[6],
          id: verilen[7],
        };
      });
  }
  
  export interface DepremHarita {
    tarih: string;
    enlem: string;
    boylam: string;
    derinlik: string;
    tip: string;
    büyüklük: string;
    yer: string;
    id: string;
  }
  export type DepremListe = [Tarih: string, Enlem: string, Boylam: string, Derinlik: string, Tip: string, Büyüklük: string, Yer: string, Id: string];