# Gemini answers via apify/gemini-search-scraper, Jim McInerney blind test run 3

Captured 2026-10-16 (run started 17:25:02 UTC, finished 17:26:55 UTC). Answers below are copied verbatim from the dataset `text` field (markdown as returned). Nothing summarized or retyped by judgment. Map-widget image URLs (gstatic) are as returned.

| Field | Value |
|---|---|
| Surface | Gemini |
| Actor | apify/gemini-search-scraper (published by Apify) |
| Run ID | n8NaQkmJGWD0gE6Kf |
| Dataset ID | sJRBNSENGKNSgwOO5 |
| Input | `queries` = the five prompts below, one per line; `countryCode` = us; run cap `maxTotalChargeUsd` = 0.50 |
| Items charged | 5 answers |
| Cost (labeled calculation) | 5 x $0.005 (BRONZE listed price) + $0.00005 actor start = $0.02505. Exact charge is in Apify Console > Runs. |
| Model and sign-in state | The actor does not report the model used or its sign-in state. Not known. |
| Order returned | Dataset order was prompt 3, 5, 4, 1, 2. Re-ordered below by prompt number only. |

## Prompt fill

Same five prompts and same fill as the ChatGPT run. Fill detail and sources are recorded in chatgpt-apify-2026-10-16.md (market La Jolla; specialty "high-end remodels and custom new construction" from jimmcinerney.com/jim-mcinerney/; price band $2 million to $17 million from the Realtor.com result as shown in a Google snippet on 2026-10-16, portal page not read by the sidekick).

1. Who are the best real estate agents in La Jolla for high-end remodels and custom new construction?
2. I'm selling a single-family home in La Jolla in the $2 million to $17 million range. Which agent should I hire?
3. What is Jim McInerney known for in real estate?
4. Is Jim McInerney a real estate agent in La Jolla?
5. Summarize Jim McInerney, La Jolla real estate agent, as a professional.

## Wrong-person signal

None seen in the Gemini text. Prompt 5 says "He has also been associated with Compass." (the LinkedIn profile read on 2026-10-16 shows Compass Jan 2020 to Apr 2024 for Jim McInerney, so this may be a stale-affiliation signal, not a wrong-person one; no source was returned for the claim). Prompt 5 also says he specializes "from La Jolla to Coronado"; no source returned.

## Answer to prompt 1

Query: Who are the best real estate agents in La Jolla for high-end remodels and custom new construction?

Sources returned: none (`sources` array empty). The answer embeds Google Maps place cards for the three businesses named.

Jim McInerney named in the answer: no.

Verbatim answer text:

~~~~
 ![](https://maps.gstatic.com/tactile/pane/default_geocode-1x.png)  

Greg Noonan & Associates

5.0 stars rating 5.0 ![](https://www.gstatic.com/gemini/maps/star.png)  

📍 Real estate agency

Open · Closes 5:30 PM

When looking for top-tier real estate professionals in La Jolla who understand the complexities of high-end property values, architectural potential, and luxury estates, Greg Noonan & Associates Click to open side panel for more information stand out as market leaders. Operating out of La Jolla, they bring decades of multi-billion-dollar luxury transaction experience, making them exceptionally skilled at evaluating properties targeted for extensive architectural remodels or tear-down custom builds.

*   **Unmatched Market Mastery:** Decades of specialized experience navigating La Jolla’s ultra-luxury neighborhoods, coastal overlay zones, and high-stakes transactions.
    
*   **Discretion and White-Glove Service:** Provides concierge-level representation tailored to high-net-worth buyers, executives, and developers.
    
*   **Investment Insight:** Deep understanding of how structural modifications, square footage expansions, and custom construction add long-term value to coastal real estate.
    

 ![](https://maps.gstatic.com/tactile/pane/default_geocode-1x.png)  

Willis Allen Real Estate - La Jolla

4.5 stars rating 4.5 ![](https://www.gstatic.com/gemini/maps/star.png)  

📍 Real estate agency

Open · Closes 5:00 PM

For historical context and deep-rooted neighborhood connections, Willis Allen Real Estate - La Jolla Click to open side panel for more information has been a cornerstone of the San Diego luxury market for generations. Their agents frequently handle significant estates, mid-century modern architectural gems, and premier lots primed for custom new construction.

*   **Local Legacy:** A deeply respected, long-standing brokerage with historic ties to La Jolla’s most prestigious enclaves.
    
*   **Architectural Expertise:** Agents within the firm specialize in unique properties, historic homes, and land values for custom builds.
    
*   **Extensive Network:** Strong relationships with elite local architects, luxury general contractors, and specialized land-use attorneys.
    

 ![](https://maps.gstatic.com/tactile/pane/default_geocode-1x.png)  

LUXURYSOCALREALTY

5.0 stars rating 5.0 ![](https://www.gstatic.com/gemini/maps/star.png)  

📍 Services

Open · Closes 10:00 PM

Led by prominent local specialists, LUXURYSOCALREALTY Click to open side panel for more information leverages modern digital marketing and high-end positioning to serve luxury buyers and sellers across La Jolla. They frequently work with clients looking to acquire modern custom homes or properties with high remodeling upside.

*   **Contemporary Marketing:** Cutting-edge visual presentation and targeted reach for luxury coastal properties.
    
*   **Design Vision:** Exceptional capability in identifying properties with the layout and spatial potential for high-end contemporary transformations.
    
*   **Client-Centric Approach:** Highly rated for responsiveness, negotiation prowess, and seamless transaction management.
    

Are you currently looking to purchase a tear-down/lot for custom construction, or are you seeking an agent to evaluate a property with heavy remodel potential?
~~~~

## Answer to prompt 2

Query: I'm selling a single-family home in La Jolla in the $2 million to $17 million range. Which agent should I hire?

Sources returned (section "citations", exactly as returned):
1. Drew Nelson | Realtor in La Jolla, CA | Willis Allen Real Estate. https://www.homes.com/real-estate-agents/drew-nelson/8vzg2j3/#:~:text=5.0%2025%20Reviews.%201%2F30%2F25Jonathan%20Marcus.%20Google%20Review.,and%20Tim%20offer%20a%20real%20insider's%20perspective. Description: "5.0 25 Reviews. 1/30/25Jonathan Marcus. Google Review. The Nelson Brothers are the absolute best real estate brokerage team in La Jolla and the broader San Die..."
2. Drew Nelson | Realtor in La Jolla, CA | Willis Allen Real Estate. https://www.homes.com/real-estate-agents/drew-nelson/8vzg2j3/ Description: "Having closed on over $1.3B of sales volume, and over $132M in 2024, we are one of the top producing teams specializing in coastal luxury real estate and"
3. La Jolla Luxury Real Estate | Jason Barry Team. https://jasonbarryteam.com/community/la-jolla/#:~:text=With%20over%20%246%20billion%20in%20career%20sales,Team%20today%20to%20schedule%20your%20confidential%20consultation. Description: "With over $6 billion in career sales and a long history of record-setting transactions, our team provides world-class service for buyers and sellers. Whether y..."
4. La Jolla Real Estate Agents | La Jolla REALTOR® | San Diego Real. https://www.luxurysocalrealty.com/ Description: "Meet The #1 Top La Jolla San Diego Realtors ... Robert and Joy Aumann, founders of LUXURYSOCALREALTY, are among the most accomplished luxury real estate agents ..."
5. Top Real Estate Agents In La Jolla, CA - FastExpert. https://www.fastexpert.com/top-real-estate-agents/la-jolla-ca/#:~:text=LUXURYSOCALREALTY%20%7C%20COMPASS.%20San%20Diego%2C%20CA.%2015,Realty%20of%20San%20Diego.%20San%20Diego%2C%20CA.  Description: "LUXURYSOCALREALTY | COMPASS. San Diego, CA. 15 Yrs of Experience. 68 Reviews. 36 sales in la jolla, ca in the last 3 years. ResponsiveKnowledgeableProfessionalC..."

Jim McInerney named in the answer: no.

Verbatim answer text:

~~~~
When selling a single-family home in La Jolla within the **$2 million to $17 million** price bracket, you are operating in a premier coastal luxury segment. This tier requires an agent or team with deep neighborhood-specific expertise, high-end digital and global marketing capabilities, and a robust network of affluent buyers (both local and international).

Several standout agents and teams consistently dominate the La Jolla luxury market and fit this exact price range:

### 1\. The Nelson Brothers (Drew & Tim Nelson) — Willis Allen Real Estate

*   **Why them:** As lifelong La Jolla residents rooted in a prominent local real estate family, the Nelson Brothers command a massive footprint in the area. They specialize in coastal luxury properties and have closed over $1.3 billion in volume, with individual transactions regularly sitting squarely in your $1.3M to $17M+ range.
    
*   **Best for:** Deep hyperlocal roots (The Village, Muirlands, La Jolla Shores, Upper Hermosa) and an exceptional track record for matching high-end buyers with off-market or newly listed properties.
    

### 2\. Jason Barry Team — Barry Estates

*   **Why them:** If you want record-setting pedigree and massive luxury exposure, the Jason Barry Team is a powerhouse in San Diego coastal real estate, with over $6 billion in career sales. They frequently handle elite multi-million-dollar estates, beachfront properties, and architecturally significant homes.
    
*   **Best for:** Maximizing exposure on ultra-luxury properties sitting on the higher end of your range, backed by global networking and high-net-worth client pipelines.
    

### 3\. Robert & Joy Aumann — LUXURYSOCALREALTY (Compass)

*   **Why them:** The Aumanns are recognized leaders in San Diego luxury real estate, specializing heavily in coastal enclaves like La Jolla. They combine cutting-edge tech platforms and modern marketing through Compass with immense local review authority and repeat/referral clientele.
    
*   **Best for:** Sellers looking for top-tier visual marketing, modern digital reach, and meticulous contract-to-close negotiation.
    

### 4\. Maxine & Marti Gellens — Berkshire Hathaway HomeServices

*   **Why them:** A legendary mother-daughter team with nearly five decades of combined experience in the San Diego and La Jolla luxury markets. They consistently rank among the top producers nationwide and have an encyclopedic knowledge of La Jolla property values, zoning, and historical nuances.
    
*   **Best for:** Multi-decade localized expertise and unmatched stability, discretion, and trust.
    

### Questions to Ask Before You Hire:

Because your home sits in a dynamic range (from entry-level luxury to ultra-luxury estates), interview at least two of these teams and ask:

1.  _Where are your current buyers coming from?_ (Look for local relocations from tech/biotech sectors vs. out-of-state buyers from LA/Silicon Valley).
    
2.  _What is your specific digital and print media strategy for a home priced at \[Your Price\]?_
    
3.  _Can you walk me through recent comparable sales you’ve closed within my immediate neighborhood (e.g., Bird Rock, Lower Hermosa, The Village, or the Country Club area)?_
    

Would you like help narrowing this down based on your home's specific neighborhood within La Jolla or its exact features (like ocean views or modern architecture)?
~~~~

## Answer to prompt 3

Query: What is Jim McInerney known for in real estate?

Sources returned: none (`sources` array empty).

Verbatim answer text:

~~~~
Jim McInerney is known for his extensive career in **luxury coastal real estate** , particularly in the **La Jolla and San Diego, California** markets.

Key highlights of his real estate background include:

*   **Experience:** Over 25 years of experience in coastal luxury real estate (with decades of deep roots living in La Jolla).
    
*   **Sales Volume:** Over $500 million in career sales, specializing in distinctive properties ranging from coastal estates and architectural builds to sophisticated renovations.
    
*   **The Jim McInerney Real Estate Team:** He leads a prominent real estate team known for marketing-led services, high-level market expertise, and elite negotiation skills serving buyers, sellers, and investors across San Diego County.
~~~~

## Answer to prompt 4

Query: Is Jim McInerney a real estate agent in La Jolla?

Sources returned: none (`sources` array empty).

Verbatim answer text:

~~~~
Yes, **Jim McInerney** is a real estate agent and team leader based in La Jolla, California.

Key details about his real estate background include:

*   **Experience:** He has over two decades of experience specializing in coastal luxury real estate, high-end home sales, new construction, and luxury property rehabilitations in the La Jolla and San Diego areas.
    
*   **Team:** He leads **The Jim McInerney Real Estate Team** (affiliated with eXp Realty).
    
*   **Local Presence:** Having spent decades rooted in the area, he also produces local community content like _Discover La Jolla_ .
~~~~

## Answer to prompt 5

Query: Summarize Jim McInerney, La Jolla real estate agent, as a professional.

Sources returned: none (`sources` array empty).

Verbatim answer text:

~~~~
**Jim McInerney** is a prominent real estate professional operating in La Jolla and the greater San Diego coastal market. Key aspects of his professional profile include:

*   **Role & Affiliation:** He is a licensed Realtor (California DRE #01334502) leading the **Jim McInerney Real Estate Team** , based out of Fay Avenue in La Jolla, California. He has also been associated with Compass.
    
*   **Local Expertise:** As a San Diego native, he leverages his deep local roots and "native knowledge" to guide clients through current market trends, specializing in coastal lifestyle properties ranging from La Jolla to Coronado.
    
*   **Specializations:** His expertise covers acquiring coastal estates, executing sophisticated renovations, building architectural masterpieces, and handling distinct residential and commercial projects.
    
*   **Client Services:** He assists both buyers and sellers, often providing practical insights on property preparation (such as strategic updates to interiors, kitchen and bathroom layouts, and landscaping) to maximize a home's value or vision.
~~~~
