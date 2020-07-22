// Create a point and a polygon
var city = ee.Geometry.Point(-101.1721, 37.8838);
var rectangle = ee.Geometry.Rectangle([-101.2926, 37.7883, -100.985, 37.9748]);
var table = ee.FeatureCollection("users/lpzampronio/Circle"),
    geometry = /* color: #d63000 */ee.Geometry.MultiPoint();
    
// Add point to the screen
Map.addLayer({eeObject: city, name: 'Point'});

// Days of interrest
var start = ee.Date('2020-01-01');
var finish = ee.Date('2020-05-05');

// Dataset
var Pivot = ee.ImageCollection('LANDSAT/LC08/C01/T1')
.filterBounds(city)
.filterDate(start, finish)
.sort('CLOUD_COVER', false);

// Number of images
var count = Pivot.size();
print('size of collection Pivot', count);

// Pick the best image
var best = ee.Image(Pivot.sort('CLOUD_COVER').first());
print('Least cloud image: ', best);

// get metadata
var date = best.get('DATE_ACQUIRED');
print('date taken', date);

// Center point
Map.centerObject(city, 12);

// NDVI
var B4_red = best.select('B4');
var B5_NIR = best.select('B5');

// NDVI expression
var ndvi = best.normalizedDifference(['B5', 'B4']);

// NDVI pallete
var ndvi_pallete = {min: 0, max: 1, palette: ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
               '74A901', '66A000', '529400', '3E8601', '207401', '056201',
               '004C00', '023B01', '012E01', '011D01', '011301']};

// Clip by mask layer
var clip = ndvi.clip(table);

// Add maps
Map.addLayer(ndvi, ndvi_pallete, 'NDVI');
Map.addLayer({eeObject: table, name: 'Talhoes'});
Map.addLayer({eeObject: clip, visParams: ndvi_pallete, name: 'Clipped'});

// Export full NDVI image
Export.image.toDrive({
  image:ndvi,
  description: 'NDVI',
  scale: 30,
  region: rectangle,
  fileFormat: 'GeoTIFF',
  formatOptions:{
    cloudOptimized: true
  }
});

// Export clipped NDVI
Export.image.toDrive({
  image: clip,
  description: 'NDVI_clipped',
  scale: 30,
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  }
});

