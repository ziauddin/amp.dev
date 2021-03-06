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

const API_ENDPOINT = API_ENDPOINT_SAFE_BROWSING;

const API_URL = `${API_ENDPOINT}?key=${AMP_DEV_PIXI_APIS_KEY}`;

export default class SafeBrowsingCheck {
  async run(pageUrl) {
    try {
      const apiResult = await this.fetchJson(pageUrl);
      return this.createReportData(null, apiResult);
    } catch (e) {
      return this.createReportData(e);
    }
  }

  createReportData(error, apiResult) {
    if (error) {
      return {error};
    }
    return {
      error,
      data: {
        result: !Object.keys(apiResult).length,
        recommendations: [],
      },
    };
  }

  async fetchJson(pageUrl) {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          'client': {
            'clientId': 'amp-dev-page-experience-checker',
            'clientVersion': '0.0.1',
          },
          'threatInfo': {
            'threatTypes': [
              'THREAT_TYPE_UNSPECIFIED',
              'MALWARE',
              'SOCIAL_ENGINEERING',
              'UNWANTED_SOFTWARE',
              'POTENTIALLY_HARMFUL_APPLICATION',
            ],
            'platformTypes': ['ANY_PLATFORM'],
            'threatEntryTypes': ['URL'],
            'threatEntries': [{'url': pageUrl}],
          },
        }),
      });

      if (!response.ok) {
        throw new Error(
          `SafeBrowsingCheck failed: response failed with status ${response.status}`
        );
      }
      const result = await response.json();
      return result;
    } catch (e) {
      throw new Error('SafeBrowsingCheck failed:', e);
    }
  }
}
