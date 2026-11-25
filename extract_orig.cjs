const fs = require('fs');

const files = [
  'cuJqbfW35i2RRVw2Q3Vaix9WO8I.webp',
  'Bqgd6mCInGuKi2DkoylipkjZttQ.webp',
  'xx4y0hmowXnxGqMdaJGre6xiLNM.webp',
  'vMtYMMpb3RXorGzKKQ7HrjYVc.webp',
  'sjHDfRZ61KmVp6cmbH6fTVWk8wQ.webp',
  'X2k4WiGTIyjwCt0kYjvNFw6Ew.webp'
];

files.forEach(f => {
  console.log(`orig_assets/${f}: exists=${fs.existsSync('orig_assets/' + f)}`);
});
