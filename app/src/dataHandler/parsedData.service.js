angular.module('evtviewer.dataHandler')

.service('parsedData', function($log, GLOBALDEFAULTCONF) {
    var parsedData = {};
    var _console = $log.getInstance('dataHandler');

    _console.log('parsedData running');
    // TODO manage unique value for pages, documents and editions
    var pagesCollection = {
        length: 0
    };
    var documentsCollection = {
        length: 0
    }; 
    
    // var pagesCollectionTexts = []; 
    
    var witnessesCollection = {
        _indexes : {
            witnesses         : [],
            groups            : [],
            encodingStructure : []
        }
    };

    var criticalAppCollection = {
        filters: { },
        // filtersColors : ['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,139)','rgb(217,239,139)','rgb(166,217,106)','rgb(102,189,99)','rgb(26,152,80)'],
        // filtersColors : ['rgb(51,102,204)', 'rgb(16,150,24)', 'rgb(255,153,0)', 
        //                  'rgb(221,68,119)', 'rgb(34,170,153)', 
        //                  'rgb(153,0,153)', 'rgb(220,57,18', 'rgb(0,153,198)', 'rgb(102,170,0)',
        //                  'rgb(184,46,46)', 'rgb(49,99,149)', 'rgb(153,68,153)'],
        filtersColors : ['rgb(52, 197, 173)', 'rgb(238, 194, 66)', 'rgb(253, 153, 54)', 'rgb(253, 95, 58)',
                         'rgb(235, 77, 153)', 'rgb(252, 144, 172)', 'rgb(171, 99, 219)', 'rgb(67, 135, 217)',
                         'rgb(163, 207, 81)', 'rgb(238, 194, 66)', 'rgb(228, 99, 220)', 'rgb(124, 113, 232)'],
        filtersLength : 0,
        __allLoaded   : false,
        _maxVariance  : 0,
        _indexes      : {
            encodingStructure : [],
            appEntries        : []
        }
    };

    var criticalTextMock = [];
    
    var mockEditions = [
        {
            value: 'critical',
            label: 'Critical',
            title: 'Critical edition'
        },
        {
            value: 'interpretative',
            label: 'Interpretative',
            title: 'Interpretative edition'
        }, 
        {
            value: 'diplomatic',
            label: 'Diplomatic',
            title: 'Diplomatic edition'
        }
    ]; 
    
    /* PAGES */
    // TODO: add attribute for the original xml reference
    parsedData.addPage = function(page) {
        var pageId = page.value;
        if ( pagesCollection.length === undefined ) {
            pagesCollection.length = 0;
        }
        
        if ( page.value === '' ) {
            pageId = page.value = 'page_'+(pagesCollection.length+1);
        }
        if ( pagesCollection[pageId] === undefined ) {
            pagesCollection[pagesCollection.length] = pageId;
            pagesCollection[pageId] = page;
            pagesCollection.length++;
            // _console.log('parsedData - addPage ', page);
        }
    };
    parsedData.getPages = function() {
        return pagesCollection;
    };
    parsedData.getPage = function(pageId) {
        return pagesCollection[pageId];
    };
    parsedData.getPageText = function(pageId) {
        var texts = [];

        var i = 0;
        while ( i < texts.length && texts[i].page !== pageId) {
            i++;
        }
        // return texts[i];
        return {};
    };
    parsedData.getPageImage = function(pageId) {
        var images = [];

        var i = 0;
        while ( i < images.length && images[i].page !== pageId) {
            i++;
        }
        // return images[i];
        return {};
    };

    /* DOCUMENTS */
    parsedData.addDocument = function(doc) {
        var docId = doc.value;
        if ( documentsCollection.length === undefined ) {
            documentsCollection.length = 0;
        }
        
        if ( doc.value === '' ) {
            docId = doc.value = 'doc_'+(documentsCollection.length+1);
        }
        if ( documentsCollection[docId] === undefined ) {
            documentsCollection[documentsCollection.length] = docId;
            documentsCollection[docId] = doc;
            documentsCollection.length++;
            // _console.log('parsedData - addDocument ', doc);
        }
    };
    parsedData.getDocuments = function() {
        return documentsCollection;
    };
    parsedData.getDocument = function(docId) {
        return documentsCollection[docId];
    };

    /* EDITION */
    parsedData.addEditions = function() {
        // var mock = {
        //     value: 'edition3',
        //     label: 'edition3 label',
        //     title: 'edition3 title'
        // };
        // mockEditions.push(mock);
    };
    parsedData.getEditions = function() {
        return mockEditions;
    };
    parsedData.getEdition = function(editionId) {
        //TODO: Rifare
        var i = 0,
            edition;
        while (i < mockEditions.length && edition === undefined) {
            if (mockEditions[i].value === editionId) {
                edition = mockEditions[i];
            }
            i++;
        }
        return edition;
    };

    /* WITNESSES */
    parsedData.addElementInWitnessCollection = function(element){
        if (witnessesCollection[element.id] === undefined) {
            witnessesCollection[element.id] = element;
            
            if (element._type === 'group') {
                witnessesCollection._indexes.groups.push(element.id);
            } else {
                witnessesCollection._indexes.witnesses.push(element.id);    
            }
            
            if (element._group === undefined) {
                witnessesCollection._indexes.encodingStructure.push(element.id);
            }
        }
    };

    parsedData.addWitnessText = function(witId, content) {
        if (witnessesCollection[witId] !== undefined) {
            witnessesCollection[witId].text = '<text>'+content+'</text>';
        }
    };
    parsedData.getWitnessText = function(witId) {
        if (witnessesCollection[witId] !== undefined) {
            return witnessesCollection[witId].text;
        }
    };
    parsedData.getWitnessesList = function() {
        return witnessesCollection._indexes.witnesses;
    };
    parsedData.getWitnesses = function() {
        return witnessesCollection;
    };
    parsedData.getWitness = function(witId) {
        return witnessesCollection[witId];
    };
    parsedData.getWitnessPages = function(witId) {
        if ( witnessesCollection[witId] !== undefined) {
            if (witnessesCollection[witId].pages === undefined) {
                var pages = { length: 0 };
                for ( var i = 0; i < pagesCollection.length; i++ ) {
                    var page = pagesCollection[pagesCollection[i]];
                    if ( page.ed === '#'+witId ) {
                        pages[pages.length] = pagesCollection[i];
                        pages[pagesCollection[i]] = page;
                        pages.length++;
                    }
                }
                witnessesCollection[witId].pages = pages;
            }
            return witnessesCollection[witId].pages;
        }
    };
    parsedData.isWitnessesGroup = function(sigla) {
        return witnessesCollection[sigla] !== undefined && witnessesCollection[sigla]._type === 'group';
    };
    parsedData.getWitnessesInGroup = function(groupId) {
        var wits = [];
        if (witnessesCollection[groupId] !== undefined && witnessesCollection[groupId]._type === 'group') {
            var groupContent = witnessesCollection[groupId].content;
            for (wit in groupContent) {
                var sigla = groupContent[wit];
                if (parsedData.isWitnessesGroup(groupContent[wit])){
                    wits.push.apply(wits, parsedData.getWitnessesInGroup(groupContent[wit]));
                } else {
                    wits.push(groupContent[wit]);
                }
            }
        }
        return wits;
    };

    /* CRITICAL ENTRIES */
    parsedData.addCriticalText = function(text, docId) {
        criticalTextMock.push(text);
    };

    parsedData.getCriticalText = function(docId) {
        return criticalTextMock[0];
    };

    parsedData.addCriticalEntry = function(entry) {
        if ( criticalAppCollection[entry.id] === undefined ) {
            criticalAppCollection[entry.id] = entry;
            criticalAppCollection._indexes.appEntries.push(entry.id);
            if (!entry._subApp) {
                criticalAppCollection._indexes.encodingStructure.push(entry.id);
            }
        }
        if (entry._variance > criticalAppCollection._maxVariance){
            criticalAppCollection._maxVariance = entry._variance;
        }
    };

    parsedData.setCriticalEntriesLoaded = function(status) {
        criticalAppCollection.__allLoaded = status;
    };

    parsedData.getCriticalEntries = function() {
        return criticalAppCollection;
    };

    parsedData.getCriticalEntryById = function(entryPos) {
        return criticalAppCollection[entryPos];
    };

    parsedData.getCriticalEntriesMaxVariance = function() {
        return criticalAppCollection._maxVariance;
    };    
    
    /* CRITICAL ENTRIES FILTERS */
    parsedData.addCriticalEntryFilter = function(name, value) {
        if (GLOBALDEFAULTCONF.possibleVariantFilters.indexOf(name) >= 0) {
            var valueObj = {
                name : value,
                color : criticalAppCollection.filtersColors[criticalAppCollection.filtersLength]
            };
            if ( criticalAppCollection.filters[name] === undefined ) {
                criticalAppCollection.filters[name] = {
                    name   : name,
                    values : {}
                };
            }
            // if ( criticalAppCollection.filters[name].values.indexOf(value) < 0 ) {
            //     criticalAppCollection.filters[name].values.push(value);
            // }
            if ( criticalAppCollection.filters[name].values[value] === undefined) {
                criticalAppCollection.filters[name].values[value] = valueObj;
                criticalAppCollection.filtersLength++;
            }
        }
    };

    parsedData.getCriticalEntriesFilters = function() {
        return criticalAppCollection.filters;
    };

    parsedData.getCriticalEntriesFilterValues = function(filter) {
        return criticalAppCollection.filters[filter];
    };

    parsedData.getCriticalEntriesFilterColor = function(filter, value) {
        return criticalAppCollection.filters[filter].values[value].color;
    };

    return parsedData;
});