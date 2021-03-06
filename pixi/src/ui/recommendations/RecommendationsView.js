// Copyright 2020 The AMPHTML Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import marked from 'marked';

export default class RecommendationsView {
  constructor(doc) {
    this.container = doc.getElementById('recommendations');
    this.template = this.container.querySelector(
      '.ap-m-pixi-recommendations-item'
    );
  }

  render(recommendations) {
    for (const item of recommendations) {
      const recommendation = this.template.cloneNode(true);
      const header = recommendation.querySelector(
        '.ap-m-pixi-recommendations-item-header'
      );
      const title = recommendation.querySelector(
        '.ap-m-pixi-recommendations-item-header-title'
      );
      const body = recommendation.querySelector(
        '.ap-m-pixi-recommendations-item-body'
      );

      recommendation.style = null;
      recommendation.id = `recommendation-${item.id}`;

      header.setAttribute(
        'on',
        `tap:recommendation-${item.id}.toggleClass(class=expanded)`
      );

      title.innerHTML = marked(item.title);
      body.innerHTML = marked(item.description);

      this.container.appendChild(recommendation);
    }
  }
}
