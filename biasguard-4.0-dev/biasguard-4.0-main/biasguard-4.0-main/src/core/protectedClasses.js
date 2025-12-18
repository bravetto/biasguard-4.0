// Protected Class Detection Patterns
// Explicit and implicit patterns for protected class identification

module.exports = {
  classes: [
    'gender', 'race', 'ethnicity', 'religion', 'nationality',
    'disability', 'age', 'sexuality', 'sexual_orientation', 'SES', 'political_identity',
    'appearance', 'weight', 'fictional_proxies'
  ],
  
  // Alias mapping for consistent naming
  classAliases: {
    'sexual_orientation': 'sexuality',
    'sexuality': 'sexual_orientation'
  },
  
  patterns: {
    gender: {
      explicit: /\b(women|men|female|male|woman|man|girls?|boys?|ladies|gentlemen|transgender|trans\s+people|trans\s+person|non-binary|nonbinary|genderqueer|agender|cisgender|cis|birth\s+gender)\b/gi,
      implicit: /\b(mother|father|sister|brother|daughter|son|wife|husband|girlfriend|boyfriend)\b/gi
    },
    race: {
      explicit: /\b(african\s+americans?|black\s+people|white\s+people|asian\s+people|asians?|hispanics?|latinos?|latinas?|native\s+americans?|indigenous|caucasians?|africans?|europeans?|blacks?|whites?)\b/gi,
      implicit: /\b(urban\s+youth|inner\s+city|ghetto|hood)\b/gi
    },
    ethnicity: {
      explicit: /\b(jews?|jewish|muslims?|christians?|hindus?|buddhists?|sikhs?|arabs?|persians?|turkish|chinese|japanese|koreans?|indians?|mexicans?|british|french|germans?|italians?|spanish|asians?)\b/gi
    },
    religion: {
      explicit: /\b(christians?|muslims?|jews?|jewish|hindu|hindus?|buddhists?|sikhs?|atheists?|agnostics?|religious|faith|belief|worship|prayer|church|mosque|temples?|synagogues?)\b/gi
    },
    nationality: {
      explicit: /\b(americans?|british|french|germans?|chinese|japanese|mexicans?|canadians?|australians?|immigrants?|refugees?|foreigners?|aliens?|citizens?|patriots?)\b/gi,
      implicit: /\b(people\s+from\s+that\s+country|those\s+foreigners|immigrants|refugees)\b/gi
    },
    disability: {
      explicit: /\b(disabled|disability|disabilities|handicapped|deaf|blind|autistic|autism|down\s+syndrome|wheelchair|paralyzed|mental\s+illness|depression|anxiety|ptsd|adhd|dyslexia|impaired|impairment)\b/gi,
      implicit: /\b(differently\s+abled|special\s+needs|challenged|confined\s+to|suffering\s+from|afflicted|wheelchair[\s-]?bound|crippled|lame|invalid|retarded)\b/gi
    },
    age: {
      explicit: /\b(elderly|senior|old\s+people|young\s+people|teenagers?|adolescents?|millennials?|gen\s+z|boomers?|generation\s+x|youth|adults?)\b|\b(children|kids?)\s+(are|is|were|was|have|has|can|cannot|can'?t)\b/gi,
      implicit: /\b(mature|immature|experienced|inexperienced)\b/gi
    },
    sexuality: {
      explicit: /\b(gay|lesbian|bisexual|homosexual|heterosexual|straight|lgbtq?\+?|queer|asexual|pansexual|transgender|trans)\s*(people|person|individuals?|men|women|couples?|parents?|families?)?\b|\b(gay|lesbian|bisexual|homosexual|heterosexual|straight|lgbtq?\+?|queer|asexual|pansexual|transgender)\b/gi,
      implicit: /\b(alternative\s+lifestyle|same-sex|opposite-sex|unnatural|immoral|against\s+nature|goes\s+against\s+nature)\b/gi
    },
    // Alias for sexual_orientation - same patterns
    sexual_orientation: {
      explicit: /\b(gay|lesbian|bisexual|homosexual|heterosexual|straight|lgbtq?\+?|queer|asexual|pansexual|transgender|trans)\s*(people|person|individuals?|men|women|couples?|parents?|families?)?\b|\b(gay|lesbian|bisexual|homosexual|heterosexual|straight|lgbtq?\+?|queer|asexual|pansexual|transgender)\b/gi,
      implicit: /\b(alternative\s+lifestyle|same-sex|opposite-sex|unnatural|immoral|against\s+nature|goes\s+against\s+nature)\b/gi
    },
    SES: {
      explicit: /\b(poor|wealthy|rich|affluent|poverty|low-income|high-income|middle-class|working-class|upper-class|lower-class|homeless|unemployed)\b/gi,
      implicit: /\b(privileged|underprivileged|disadvantaged|advantaged|that\s+background|from\s+that\s+background)\b/gi
    },
    political_identity: {
      explicit: /\b(republicans?|democrats?|liberals?|conservatives?|left-wing|right-wing|socialists?|capitalists?|fascists?|communists?|progressives?|moderates?|patriots?)\b/gi
    },
    appearance: {
      explicit: /\b(beautiful|ugly|attractive|unattractive|handsome|pretty|plain|good-looking|bad-looking)\b/gi
    },
    weight: {
      explicit: /\b(fat|obese|overweight|thin|skinny|slim|heavy|light|weight|body\s+size|body\s+type)\b/gi
    },
    fictional_proxies: {
      implicit: /\b(those\s+people|these\s+people|them|they|their\s+kind|that\s+group|such\s+people)\b/gi
    }
  },
  
  // Implicit mappings: group references → protected classes
  implicitMappings: {
    'people from that country': ['nationality', 'ethnicity'],
    'those people': ['fictional_proxies'],
    'these people': ['fictional_proxies'],
    'they always': ['fictional_proxies'],
    'that group': ['fictional_proxies'],
    'their kind': ['fictional_proxies'],
    'immigrants': ['nationality', 'ethnicity'],
    'refugees': ['nationality', 'ethnicity'],
    'foreigners': ['nationality', 'ethnicity'],
    'from that background': ['SES'],
    'that background': ['SES']
  }
};

