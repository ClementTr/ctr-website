const IMG_BASE = 'https://s3.us-east-1.amazonaws.com/clementtailleur.com/img/map';

function escapeHtml (s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * HTML pour le panneau détail (carousel Bootstrap + texte), à injecter via innerHTML.
 */
export function buildTripDescriptionHtml (country, city, textDescription, journey) {
  let html = '<b>' + escapeHtml(country) + '</b> - ' + escapeHtml(city) + '<br/>';
  journey.forEach(function (j, i) {
    html += i === 0 ? j.year : ' & ' + j.year;
  });

  const carouselItems = [];
  journey.forEach(function (j) {
    j.photos.forEach(function (photo) {
      carouselItems.push({ year: j.year, photo });
    });
  });

  if (carouselItems.length > 1) {
    html += buildCarouselHtml(carouselItems);
  } else if (carouselItems.length === 1) {
    const one = carouselItems[0];
    html += '<div class="text-center"><img style="width:100%" src="' + IMG_BASE + '/' + one.year + '/' + one.photo + '" alt=""/></div>';
  }

  const text = Array.isArray(textDescription) ? textDescription.join(' ') : textDescription;
  html += '<p class="text_description">' + escapeHtml(text) + '</p>';
  return html;
}

function buildCarouselHtml (carouselItems) {
  const carouselId = 'journeyTripCarousel';
  let str = '<div id="' + carouselId + '" class="carousel slide" data-ride="carousel">';
  str += '<ol class="carousel-indicators">';
  for (let cpt = 0; cpt < carouselItems.length; cpt++) {
    str += '<li data-target="#' + carouselId + '" data-slide-to="' + cpt + '"' + (cpt === 0 ? ' class="active"' : '') + '></li>';
  }
  str += '</ol><div class="carousel-inner">';
  for (let cpt = 0; cpt < carouselItems.length; cpt++) {
    const description = carouselItems[cpt];
    str += '<div class="carousel-item' + (cpt === 0 ? ' active' : '') + '">';
    str += '<img src="' + IMG_BASE + '/' + description.year + '/' + description.photo + '" style="width:100%" alt="">';
    str += '<div class="carousel-caption d-none d-md-block"><h5>' + description.year + '</h5></div>';
    str += '</div>';
  }
  str += '</div>';
  str += '<a class="carousel-control-prev" href="#' + carouselId + '" role="button" data-slide="prev">';
  str += '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span></a>';
  str += '<a class="carousel-control-next" href="#' + carouselId + '" role="button" data-slide="next">';
  str += '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span></a>';
  str += '</div>';
  return str;
}
