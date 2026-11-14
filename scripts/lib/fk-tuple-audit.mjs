/**
 * Compare complete ordered physical foreign-key tuples with the existing
 * schema_relation (which stores only one from/to column pair).
 *
 * Evidence-only: no SQL writes, no new authority or clinical admission.
 */
/**
 * @typedef {{ constraint_name:string, child_table:string, parent_table:string,
 *   child_columns:string[], parent_columns:string[] }} PhysicalFK
 * @typedef {{ name:string, from_entity:string, to_entity:string,
 *   from_column:string, to_column:string }} DictionaryRelation
 * @param {PhysicalFK[]} foreignKeys
 * @param {DictionaryRelation[]} dictionaryRelations
 */
export function analyzeFkTuples(foreignKeys, dictionaryRelations) {
  const findings = [];
  for (const fk of foreignKeys) {
    const childColumns = fk.child_columns;
    const parentColumns = fk.parent_columns;
    if (!Array.isArray(childColumns) || !Array.isArray(parentColumns)
        || childColumns.length === 0 || childColumns.length !== parentColumns.length
        || !childColumns.every(x => typeof x === 'string' && x.length)
        || !parentColumns.every(x => typeof x === 'string' && x.length)) {
      throw new Error('Malformed physical FK tuple: ' + (fk.constraint_name ?? 'unknown'));
    }
    const pair = (r, i) => (
      (r.from_entity === fk.parent_table && r.to_entity === fk.child_table
        && r.from_column === parentColumns[i] && r.to_column === childColumns[i])
      || (r.from_entity === fk.child_table && r.to_entity === fk.parent_table
        && r.from_column === childColumns[i] && r.to_column === parentColumns[i])
    );
    const firstPair = dictionaryRelations.filter(r => pair(r, 0));
    const matchesAnyComponent = dictionaryRelations.filter(r =>
      childColumns.some((_, i) => pair(r, i)));
    const composite = childColumns.length > 1;
    findings.push({
      constraint: fk.constraint_name,
      childTable: fk.child_table,
      parentTable: fk.parent_table,
      childColumns: [...childColumns],
      parentColumns: [...parentColumns],
      firstPairRelationNames: firstPair.map(r => r.name),
      anyPairRelationNames: [...new Set(matchesAnyComponent.map(r => r.name))],
      firstPairDescribed: firstPair.length > 0,
      composite,
      // schema_relation has scalar columns; a matching first pair does not
      // establish ordered complete-tuple fidelity for a composite FK.
      status: composite ? 'HOLD_COMPOSITE_TUPLE_UNREPRESENTED'
        : firstPair.length ? 'SCALAR_PAIR_REPRESENTED'
        : 'MISSING_SCALAR_DICTIONARY_RELATION',
    });
  }
  return {
    physicalForeignKeys: findings.length,
    compositeForeignKeys: findings.filter(f => f.composite).length,
    scalarForeignKeys: findings.filter(f => !f.composite).length,
    missingScalar: findings.filter(f => f.status === 'MISSING_SCALAR_DICTIONARY_RELATION'),
    compositeHolds: findings.filter(f => f.composite),
    findings,
    // Physical constraints exist, but there is no complete tuple metadata
    // for composite FKs; never call that state approved.
    completeRelationMetadata: findings.every(f => f.status === 'SCALAR_PAIR_REPRESENTED'),
  };
}
