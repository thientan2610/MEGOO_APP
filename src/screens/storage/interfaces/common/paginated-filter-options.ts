export enum FilterSuffix {
  NOT = '$not',
}

export enum FilterOperator {
  EQ = '$eq',
  GT = '$gt',
  GTE = '$gte',
  IN = '$in',
  NULL = '$null',
  LT = '$lt',
  LTE = '$lte',
  BTW = '$btw',
  ILIKE = '$ilike',
  SW = '$sw',
  CONTAINS = '$contains',
}

export enum FilterComparator {
  AND = '$and',
  OR = '$or',
}
