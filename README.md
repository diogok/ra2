# Rapid Automated Risk Assessment

(Just writing so I don't loose the idea)

Trying to evaluate the risk of extinction of the whole using rapid assessment techniques, based on geographical information on occurrence data, to achieve the IUCN B criteria.

Keeping in analysis also the metadata included and quality measurement.

Thou it will take any specie (and species only), I only have experience with flora so I will focus on that (Maybe I should limit my self on it).

## Rationale

Prioritizing conservation efforts has become one of the most crucial steps in preserving biodiversity (Hoffmann et al. 2010; Keith et al. 2004; Mace et al. 2008; Miller et al. 2007)

Must of the introduction of Jun Cheng, 2013 can be applied here.

## Details on the data used

### Taxonomy and checklist

### Occurrence 

### Risk assessment (previous)

### On Metadata

Metadata is a description of the characteristics of data that has been collected for a specific purpose [ANZLIC, 1996a]. Metadata must accompany all record and recordset.

### Data quality

Rapid automated risk assessment must take in account the bad quality of data in biodiversity datasets (according to whom?), but this quality can be measured and therefore will be displayed along with the risk assessment. This measure is important to avid the kind of decision that could be wrongly taken, as exposed by [Chapman, 2005].


Since GBIF it self (where we get most of our data) already perform a series of data quality improvments, and to keep the project in time, we will not perform data quality improvments, be such should be considerate if we expand on data sources.

Used here is a Pragmatic Information Quality measure [E.Dalcin], where it is taken into account the usefulness of the data.
y
There to many metrics that one could apply, but I focused on the ones that seen more relevant to the geographic distribution of occurrences.

So, taking as base the 15 dimensions of 4 categories of [Strong et al., 1997]:

Non relevant to the work:

- Intrisic: Since this is mediated data already, it would be useless analysis to our scope.
- Acessibility: While using only GBIF data, we can't compare to "non-available" data in a systematic way.

The used metrics, that we can safely measure, and is pragmatic:

- Contextual
- Representational

So:

- Relevancy: ?
- Value-added: ?
- Timeliness: A closely related concept is currency, which is interpreted as the time
a data item has been stored (Wand and Wang, 1996)
- Completeness
- Amount of Data
- Interpretability
- Ease of understanding
- Concise representation
- Consistent representation


Alseo, following [Barros et al, 2014], "We have used the five-component scheme for assessing dataset quality".

- Lineage
- Completeness
- Atrtribute accuracy
- Logical Consistency
- POsitional accuracy




### Protected areas

TBD.

### Threats

TBD.

### Other aggregation

TBD. Much like the original idea on [iSpecies], by R.M.Page, we could also aggregate, without analysis, anxillary data from other sources. Maybe with more time.

## Data sources

- GBIF checklist
- GBIF occurrences
- IUCN redlist

### Other (not used yet)

- biostor.org
- bionames.org
- EOL.org
- tropicos

## Method

Area of Occupancy (AO) is a frequently used indicator to assess and inform designation of conservation status to wildlife species by the International Union for Conservation of Nature (IUCN)[Jun Cheng, 2013]. We also take into account the number of locations.


From the IUCN Red List Categories and Criteria:

Criteria B 
- B1 (EOO)
-- EOO < 100km² = CR
-- EOO < 5000km² = EN
-- EOO < 20000km² = VU
- B2 (AOO)
-- AOO < 10km² = CR
-- AOO < 500km² = EN
-- AOO < 2000km² = VU
- Also:
-- Locations = 1 for CR
-- Locations <= 5 for EN
-- Locations <= 10 for VU

VU D2
- AOO < 20km² or Locations <= 5

EOO calculation using minimum convex hull.
AOO calculation using movable grid, of:
- 0.5km²
- 1km²
- 2km²
- 5km²
Number of locations using: ? (max dist + buffer + union when touch + count)


## Future

I see three important future improvments:

- Protected area data
- Threat area
- Curation of occurrence data

The last item is more trouble some.

### Curation of occurrence data

As shown by too many papers, data raw from GBIF (or most of the available sources, really) is of very low quality. Since the work in the Brasilian risk assessment, as with the analysis of Barros et al, 2014, for a confident analysis of occurrence data, curation must happen. 

Annotation would be a way to improve quality of the data without interfearing with it, but we must have a way to make such data curation available back to the data owner. 

Also, of whom will be able to manage the data, as this must be done by specialists in the taxonomy related to the occurrence, a network of such specialists (a self managed community) must also exists. I have not looked into it yet, but probably some initiatives already are under way.

In Brazil, there is the Virtual Herbarium project to implement such collaborative curation, but it is not yet available.

Anyway, this is a problem to deal with.

## References

TBD.

## License

MIT

