export interface Join {
  joinTableName: string;
  forignKeyName: string;
  whereKeyName: string;
  whereValue: string | number;
}
