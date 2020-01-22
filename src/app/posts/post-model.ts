// wir erstellen ein Modell für Post, da wir immer die 2 Daten Titel und content verwenden.
// wir sagen somit wie unser Post aussehen sollte
// export wird verwendet damit es auserhalb verwendet werden kann


export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
}
