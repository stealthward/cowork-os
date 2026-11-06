# ChatGPT answers via apify/chatgpt-search-scraper, Jim McInerney blind test run 3

Captured 2026-10-16 (run started 17:24:15 UTC, finished 17:28:40 UTC). Answers below are copied verbatim from the dataset `text` field (markdown as returned). Nothing summarized or retyped by judgment.

| Field | Value |
|---|---|
| Surface | ChatGPT (ChatGPT Search) |
| Actor | apify/chatgpt-search-scraper (published by Apify) |
| Run ID | xlin8JecRoz1q1Bvy |
| Dataset ID | ApQKRBBaiI7bZQai2 |
| Input | `queries` = the five prompts below, one per line; `countryCode` = us |
| Items charged | 5 answers |
| Cost (labeled calculation) | 5 x $0.005 (BRONZE listed price) + $0.00005 actor start = $0.02505. Exact charge is in Apify Console > Runs. |
| Model and sign-in state | The actor does not report the model used or its sign-in state. Not known. |
| Order returned | Dataset order was prompt 4, 3, 2, 1, 5. Re-ordered below by prompt number only. |

## Prompt fill

Fill rule from search-visibility.md: narrowest market the agent's own site names first, the agent's own words for specialty, portal sold range rounded.

| Slot | Value used | Where it came from |
|---|---|---|
| [narrowest market] | La Jolla | jimmcinerney.com homepage ("Discover La Jolla", 1616 Clemson Circle, 7145 Fairway Road) and jimmcinerney.com/jim-mcinerney/ ("throughout La Jolla"). Captured 2026-10-16. |
| [stated specialty] | high-end remodels and custom new construction | jimmcinerney.com/jim-mcinerney/ bio, verbatim: "specializes in helping clients navigate and complete high-end remodels and custom new construction throughout La Jolla". |
| [property type] | single-family home | Chosen by the sidekick (the site lists single-family listings; no portal property-type breakdown was read). Not from a source. |
| [selling or buying] | selling | Chosen by the sidekick (prompt 2 template uses either). |
| [price band] | $2 million to $17 million | Realtor.com result as shown in the Google snippet on 2026-10-16: "9 recent sales $2.09M - $17.34M price range", rounded. The Realtor.com page itself was NOT read (portals are read by the CMO). Treat as unconfirmed until the CMO reads the portal. Cross-check: jimmcinerney.com Instagram post of 2026-09-01 states 1920 Spindrift Drive "closed for $17,340,000". |

## Prompts as run

1. Who are the best real estate agents in La Jolla for high-end remodels and custom new construction?
2. I'm selling a single-family home in La Jolla in the $2 million to $17 million range. Which agent should I hire?
3. What is Jim McInerney known for in real estate?
4. Is Jim McInerney a real estate agent in La Jolla?
5. Summarize Jim McInerney, La Jolla real estate agent, as a professional.

## Wrong-person signal

In the answer to prompt 4 the returned text includes an image whose alt text reads "James McInerney | Realtor in Potomac, MD | Coldwell Banker Realty" placed directly above the heading "Jim McInerney / The Jim McInerney Real Estate Team". That is an image of a different agent (name match, different state and brokerage) shown inside the identity answer. The Jim McInerney Real Estate Team sources named for that answer are realtor.com and jimmcinerney.com (see below). No other wrong-person signal appeared in the ChatGPT text. (Google's AI Overview on 2026-10-16 also warned of separate profiles for a James McInerney in San Francisco and one in Potomac, MD; see gather-pack.md.)

## Answer to prompt 1

Query: Who are the best real estate agents in La Jolla for high-end remodels and custom new construction?

Sources returned (section "attached"):
1. LUXURYSOCALREALTY, https://www.lajollalife.com/?utm_source=chatgpt.com
2. Scott Harden, https://scotthardenrealtor.com/agents/scott-harden/?utm_source=chatgpt.com
3. Greg Noonan & Associates, https://lajollahomes.com/la-jolla-luxury-realtor/?utm_source=chatgpt.com
4. Sonja Huter Homes, https://sonjahuter.com/?utm_source=chatgpt.com
5. Hexagon Design + Build, https://hexagondesignbuild.com/la-jolla/?utm_source=chatgpt.com

Jim McInerney named in the answer: no.

Verbatim answer text:

~~~~
*   For high-end remodels and custom new construction in La Jolla, I’d prioritize agents who understand more than luxury home sales: they should know which properties have genuine redevelopment potential, how coastal location affects value, and how to evaluate a finished home versus one that needs a major investment.
    
    My shortlist would start with established La Jolla luxury specialists, then narrow to agents who can demonstrate actual experience with architect-designed homes, teardown opportunities, and custom builds.
    
    My top agents to interview
    --------------------------
    
    ![La Jolla Real Estate Agents | La Jolla REALTOR® | San Diego Real Estate Agents](https://images.openai.com/static-rsc-4/4lKNj2eJxwnrAM0JPiWtpw2nv4csl-8PreCHTS21CbmZbLXYwtFoY4b4hN-LB9_pbpY19sUr2exO5SLs0cH3JX_ICraJmqlGSqcLQLkis3v6l3q9_BE-rNDHMDnyHFA02UrJIytN8w3xHZaKP2G1qNR_BJ-GW7By1pg5042i368?purpose=inline) 
    
    1\. Joy and Robert Aumann — LUXURYSOCALREALTY
    ---------------------------------------------
    
    Strong first interview
    
    Luxury coastal properties · Buyer and seller representation
    
    The team reports more than $750 million in career sales and experience with significant waterfront transactions. I’d interview them first if you're considering a premium property where location, resale value, and negotiation strategy are critical. Ask specifically for examples involving major renovations or new construction, rather than relying on luxury sales volume alone.
    
    ![](https://www.google.com/s2/favicons?domain=https://www.lajollalife.com&sz=32) 
    
    La Jolla Real Estate Agents
    
    +1
    
    Website: [LUXURYSOCALREALTY](https://www.lajollalife.com/?utm_source=chatgpt.com)  · (858) 752-8730
    
    ![La Jolla Agents, 323 Compass Real Estate Agents - Compass](https://images.openai.com/static-rsc-4/hs5KdZ5LMY93PhOV7Qu62KCtt9cBrW6yEEunsG_BU9svS3XXZ66JEHC6_WueEZmleb5QLfo-pf6vP16J3_okBDiUM70WKtiq5rw9tGI8Jv6Zbe4_xbQ2bNj7WJCvj6mvfnowAZ1iNJl98vjb6XlC-rFflyK_lDIHCz6nPaxb8uo?purpose=inline) 
    
    2\. Scott Harden
    ----------------
    
    Local knowledge · Planning and development background
    
    Harden grew up in La Jolla and has a degree in urban planning and development, along with experience building custom homes. That combination makes him especially worth interviewing if you're assessing a property for a substantial remodel or a potential ground-up build. Verify his recent La Jolla project experience and permitting-related track record.
    
    ![](https://www.google.com/s2/favicons?domain=https://scotthardenrealtor.com&sz=32) 
    
    La Jolla, CA Real Estate Agents
    
    Website: [Scott Harden](https://scotthardenrealtor.com/agents/scott-harden/?utm_source=chatgpt.com)  · (858) 610-5283
    
    ![Top Real Estate Agents in La Jolla | Greg Noonan](https://images.openai.com/static-rsc-4/ZfbbX2cw7qhp1hKltd_0cXL2jAsFiEdCaTNnIO57hWoN4Kq9WhBHkdpTUuy4djwLNBA6eW7uyeL_vK0OvcYKRFqDIEWe2h14N67HcyXd5XzciM5c6ZnTgbANillfW2xbdWeoouidf4j73s8Kt0ed84-ov7MorRD5MITnH-X5ZA8?purpose=inline) 
    
    3\. Greg Noonan & Associates
    ----------------------------
    
    Established luxury market presence · High-value estates
    
    Noonan's team reports more than 2,500 home sales and $3 billion in sales volume, with experience representing prominent La Jolla estates and oceanfront properties. I’d consider them for a high-budget acquisition where comparable sales, pricing strategy, and understanding the luxury buyer pool are central. Ask for examples of projects purchased before renovation or redevelopment.
    
    ![](https://www.google.com/s2/favicons?domain=https://lajollahomes.com&sz=32) 
    
    Greg Noonan
    
    +1
    
    Website: [Greg Noonan & Associates](https://lajollahomes.com/la-jolla-luxury-realtor/?utm_source=chatgpt.com)  · (800) 525-6552
    
    ![Sonja Huter | Realtor in Rancho Santa Fe, CA | Berkshire Hathaway HomeServices California Properties](https://images.openai.com/static-rsc-4/nSqeOZQHZmpB66hdTQI7Ewfx1ed5nBBH29iWCZ7j7wlZg0n6sRLlombg_O6GY2bU5Kmu7cBbYNwe242mPpYC9BSHtPTPb8DjhuM6BGtMLQJF1ERZJQEA7hRtAFL5CShfoPBTaaFUxa_xGai4HLmi0qDLBF51dB0iEpZdRKuBRcs?purpose=inline) 
    
    4\. Sonja Huter
    ---------------
    
    Luxury homes · New-construction marketing
    
    Huter works across La Jolla, Del Mar, and Rancho Santa Fe, with a stated focus on luxury properties and new construction. She is worth considering if you want to build a custom home and eventually sell it, or if you're buying a newly built luxury residence. Confirm that she has experience on the acquisition and construction-planning side as well as marketing completed homes.
    
    ![](https://www.google.com/s2/favicons?domain=https://sonjahuter.com&sz=32) 
    
    Sonja Huter Homes
    
    Website: [Sonja Huter Homes](https://sonjahuter.com/?utm_source=chatgpt.com) 
    
    Which agent is best for your particular project?
    ------------------------------------------------
    
    | 
    Your priority
    
     | 
    
    Who I’d interview first
    
     |
    | --- | --- |
    | 
    
    Buying a dated ocean-view home to transform
    
     | 
    
    Scott Harden
    
     |
    | 
    
    Acquiring a premium coastal property with strong resale potential
    
     | 
    
    Joy and Robert Aumann
    
     |
    | 
    
    Negotiating on a high-value La Jolla estate
    
     | 
    
    Greg Noonan & Associates
    
     |
    | 
    
    Building a custom luxury home for eventual resale
    
     | 
    
    Sonja Huter
    
     |
    
    These are interview priorities based on publicly described experience, not an independently verified ranking of construction-project outcomes.
    
    What matters most for remodels and custom builds
    ------------------------------------------------
    
    A great luxury listing agent isn't automatically a great redevelopment advisor. Before hiring anyone, I'd ask each candidate these five questions:
    
    1.  Show me three La Jolla properties you represented that underwent a major remodel or custom rebuild.
        
    2.  Have you helped clients evaluate teardown economics, architect feasibility, construction budgets, and after-completion market value?
        
    3.  How familiar are you with coastal development restrictions, local permitting, setbacks, and potential view impacts?
        
    4.  Can you introduce me to two architects and two licensed design-build contractors whose work you've personally seen?
        
    5.  Can you provide comparable sales for both renovated luxury homes and unrenovated properties with similar land, views, and location?
        
    
    For the construction side, you'll also want independent professionals. For example, [Hexagon Design + Build](https://hexagondesignbuild.com/la-jolla/?utm_source=chatgpt.com)  advertises custom construction and whole-home remodeling in La Jolla. You can use a qualified builder or architect to assess feasibility independently of the agent's sales advice.
    
    ![](https://www.google.com/s2/favicons?domain=https://hexagondesignbuild.com&sz=32) 
    
    Hexagon
    
    One question that would help me narrow this down
    ------------------------------------------------
    
    Are you planning to buy a property to remodel or rebuild, or do you already own a La Jolla property and want an agent to help manage the project strategy and eventual resale?
    
    That distinction changes who I'd put at the top of the list.
~~~~

## Answer to prompt 2

Query: I'm selling a single-family home in La Jolla in the $2 million to $17 million range. Which agent should I hire?

Sources returned (section "attached"):
1. LUXURYSOCALREALTY, https://www.compass.com/agents/luxurysocalrealty/?utm_source=chatgpt.com
2. Luxury & Coastal Group, https://www.luxuryandcoast.com/?utm_source=chatgpt.com
3. Dane Soderberg & Associates, https://www.compass.com/?utm_source=chatgpt.com

Jim McInerney named in the answer: no.

Verbatim answer text:

~~~~
*   For a single-family home in La Jolla priced anywhere from $2 million to $17 million, I would hire an agent who specializes in luxury residential listings in La Jolla itself, has a verifiable record of selling homes in your property's price bracket, and can demonstrate how they will reach qualified buyers—not simply an agent with a famous name or a large social-media following.
    
    The price range matters a great deal here. A $2 million coastal-area home and a $17 million oceanfront estate may require different buyer networks, marketing strategies, and negotiating experience. The best agent is the one whose recent sales most closely match your property's location, value, and type.
    
    My shortlist: three agents to interview
    ---------------------------------------
    
    ![La Jolla Real Estate Agents | La Jolla REALTOR® | San Diego Real Estate Agents](https://images.openai.com/static-rsc-4/4lKNj2eJxwnrAM0JPiWtpw2nv4csl-8PreCHTS21CbmZbLXYwtFoY4b4hN-LB9_pbpY19sUr2exO5SLs0cH3JX_ICraJmqlGSqcLQLkis3v6l3q9_BE-rNDHMDnyHFA02UrJIytN8w3xHZaKP2G1qNR_BJ-GW7By1pg5042i368?purpose=inline) 
    
    1. Rob and Joy Aumann — LUXURYSOCALREALTY, Compass
    --------------------------------------------------
    
    My first call
    
    Best initial candidate if the property is a high-end coastal home or estate. Their published track record includes more than $750 million in career sales, 16 waterfront transactions, representation of the buyer in La Jolla's reported $47 million record sale, and a $16 million oceanfront transaction.
    
    ![](https://www.google.com/s2/favicons?domain=https://www.lajollalife.com&sz=32) 
    
    La Jolla Life
    
    +2
    
    Why interview them: Their experience appears relevant to both ends of your range, particularly if your home has ocean views, waterfront access, architectural distinction, or estate-level amenities.
    
    Contact: [LUXURYSOCALREALTY](https://www.compass.com/agents/luxurysocalrealty/?utm_source=chatgpt.com)  · (858) 752-8730
    
    ![La Jolla Real Estate | La Jolla Property Group](https://images.openai.com/static-rsc-4/kPsVxhUfR99obUh6xL1mN_xyYtydX0myO7tfBZpELXtSr0403nrGZ7DY4apuuT_46v7O7qXLseZasqRZyG1TAo8MU-IYPu_AP6UbtaJzbfEpB1rTfIWTGSfJVm7Gr6D3uIhmcl4InHDbj6kc7B9HffrjwxJH8_xgjt63ZjYm84M?purpose=inline) 
    
    2. Jay Becker — Luxury & Coastal Group, Pacific Sotheby's
    ---------------------------------------------------------
    
    Worth interviewing if you want a highly involved, concierge-style listing process, including preparation, vendor coordination, premium marketing, and personal transaction management. The team's published materials emphasize global luxury exposure and hands-on service.
    
    ![](https://www.google.com/s2/favicons?domain=https://www.luxuryandcoast.com&sz=32) 
    
    Luxury & Coastal Group
    
    Why interview him: A potentially strong fit for a distinctive luxury property that needs careful presentation or substantial pre-sale preparation.
    
    Contact: [Luxury & Coastal Group](https://www.luxuryandcoast.com/?utm_source=chatgpt.com)  · (858) 222-4321
    
    ![Dane Soderberg](https://images.openai.com/static-rsc-4/H-5d1hzi5FFMJHjxhJ04bZdHqsovmDB0fsnOtMshptrERxaTSLA6HrAYxyH6Lb2nLfrH1KAlY2G1DxJ3kxlCoeFEUtWuFejFXtygjCQDx2hJ5yM9d1dK2yBVKwJh6I2bFvDHOEfcEisoHj2_3nm1L61WqKv4iZphDJoUnxuaEAg?purpose=inline) 
    
    3. Dane Soderberg — Compass
    ---------------------------
    
    A useful comparison candidate for a La Jolla-focused listing. His team highlights coastal-market experience and a marketing-led approach, including staging and public-relations campaigns for luxury properties.
    
    ![](https://www.google.com/s2/favicons?domain=https://www.google.com&sz=32) 
    
    google.com
    
    +1
    
    Why interview him: To compare a neighborhood-focused strategy and listing execution against the larger luxury-network approach of the first two candidates.
    
    Contact: [Dane Soderberg & Associates](https://www.compass.com/?utm_source=chatgpt.com)  · (858) 337-1417
    
    These are candidates to interview, not a definitive ranking of agent performance. The available public information is useful for narrowing the field, but it does not independently establish which agent would achieve the highest net sale price for your particular property.
    
    How I'd make the final decision
    -------------------------------
    
    Ask each agent for the same evidence before signing a listing agreement:
    
    *   Three to five recent La Jolla single-family sales in or near your price bracket, identifying which transactions they personally listed—not just bought for clients or participated in as part of a team.
        
    *   A pricing analysis with comparable closed sales, current competition, and a realistic expected sale-price range.
        
    *   A written marketing plan: professional photography, video, staging, targeted outreach to qualified buyers and their agents, and an explanation of how they reach buyers outside San Diego.
        
    *   Their negotiation plan: how they would handle an early offer, multiple offers, appraisal gaps, contingencies, and requests for concessions.
        
    *   Their proposed commission and contract terms, including cancellation rights, listing duration, and any additional marketing costs.
        
    
    For the $10 million–$17 million end of your range, I'd put especially heavy weight on directly comparable estate sales and the agent's ability to engage serious, financially qualified buyers. A prestigious brokerage name alone is not enough.
    
    ### Your La Jolla agent shortlist
    
    Reset viewExpand map
    
    Map data is currently unavailable
    
    One question that would change my recommendation
    ------------------------------------------------
    
    Where in La Jolla is the home, and roughly what is its likely sale price?
    
    For example, an oceanfront property on Camino de la Costa, an estate in La Jolla Farms, a Muirlands home, and a property in the Village can call for different agent specializations. If you share the neighborhood and an approximate price—say, $3 million, $7 million, or $15 million—I can narrow this down to the strongest candidates for your specific listing.
~~~~

## Answer to prompt 3

Query: What is Jim McInerney known for in real estate?

Sources returned (section "attached"):
1. official real estate website, https://jimmcinerney.com/?utm_source=chatgpt.com

Inline source chips in the text (as rendered in the returned markdown, domains only): Showcase (showcase.com, +1, +2) and LinkedIn (linkedin.com, "Jim McInerney", +1). These are not in the `sources` array.

Verbatim answer text:

~~~~
*   Jim McInerney is best known as a luxury coastal real estate specialist in San Diego, California, particularly in La Jolla and the surrounding upscale coastal communities. He leads the Jim McInerney Real Estate Team, currently associated with eXp Realty of Southern California.
    
    ![](https://www.google.com/s2/favicons?domain=https://www.showcase.com&sz=32) 
    
    Showcase
    
    +1
    
    What he is known for
    --------------------
    
    *   Luxury and oceanfront properties: Buying and selling high-end homes, coastal estates, and properties with ocean views.
        
    *   Expertise in La Jolla: As a La Jolla native, he emphasizes his firsthand knowledge of the local market and coastal lifestyle.
        
    *   Investment real estate: Helping clients acquire and market investment properties, land, and other residential assets.
        
    *   Property marketing and negotiation: Providing personalized representation, strategic marketing, and guidance for buyers and sellers.
        
    *   Substantial sales experience: His professional profiles report more than $365 million in cumulative real estate transactions.
        
        ![](https://www.google.com/s2/favicons?domain=https://www.showcase.com&sz=32) 
        
        Showcase
        
        +2
        
    
    His market and reputation
    -------------------------
    
    McInerney's business focuses on San Diego's premium coastal communities, including La Jolla, Del Mar, Rancho Santa Fe, and Coronado. His team has also highlighted industry recognition, including a reported ranking of No. 54 in sales volume among San Diego County real estate agents for 2024.
    
    ![](https://www.google.com/s2/favicons?domain=https://www.linkedin.com&sz=32) 
    
    Jim McInerney
    
    +1
    
    In short: He is primarily known for luxury residential real estate, coastal properties, and local market expertise in the San Diego area.
    
    For more information, visit his [official real estate website](https://jimmcinerney.com/?utm_source=chatgpt.com) .
~~~~

## Answer to prompt 4

Query: Is Jim McInerney a real estate agent in La Jolla?

Sources returned (section "attached"):
1. California Department of Real Estate's official website, https://www.dre.ca.gov/?utm_source=chatgpt.com
2. official real estate website, https://jimmcinerney.com/?utm_source=chatgpt.com

Inline source chips in the text (domains only): realtor.com (+2, +1), jimmcinerney.com / "Jim McInerney Real Estate Team" (+1). Not in the `sources` array.

Verbatim answer text:

~~~~
*   Yes. Jim McInerney is a real estate professional who serves La Jolla, California. Multiple real estate listings and professional profiles identify him as a licensed California real estate agent.
    
    ![](https://www.google.com/s2/favicons?domain=https://www.realtor.com&sz=32) 
    
    realtor.com®
    
    +2
    
    ![James McInerney | Realtor in Potomac, MD | Coldwell Banker Realty](https://images.openai.com/static-rsc-4/atW6wqZ6xaYD2XNErB_l0unNmpKMqZ2lDZqyJTUDFKy9Dac9Ize1IEn7owatlD66K1VneyE5wueX03eJWv0D83T9InSHJsvGB9eBGjzhBMesFcfaTlk9szpKbo62x1BlKWKYrMYUAiKIHLzUAZDFxXEWiydory0TXJOnGJtxGoQ?purpose=inline) 
    
    Jim McInerney
    -------------
    
    The Jim McInerney Real Estate Team
    
    *   California real estate license: 01334502
        
        ![](https://www.google.com/s2/favicons?domain=https://www.realtor.com&sz=32) 
        
        realtor.com®
        
        +1
        
    *   Office: 7590 Fay Avenue, Suite 200, La Jolla, CA 92037
        
        ![](https://www.google.com/s2/favicons?domain=https://jimmcinerney.com&sz=32) 
        
        Jim McInerney Real Estate Team
        
        +1
        
    *   Phone: (858) 480-9945
        
        ![](https://www.google.com/s2/favicons?domain=https://jimmcinerney.com&sz=32) 
        
        Jim McInerney Real Estate Team
        
        +1
        
    *   Brokerage: Currently identified in his team's materials as eXp Realty of Southern California.
        
        ![](https://www.google.com/s2/favicons?domain=https://jimmcinerney.com&sz=32) 
        
        Jim McInerney Real Estate Team
        
        +1
        
    
    How to verify his credentials
    -----------------------------
    
    You can check his license directly through the [California Department of Real Estate's official website](https://www.dre.ca.gov/?utm_source=chatgpt.com) . Search for license number 01334502 to verify its current status and associated broker information.
    
    You can also visit his [official real estate website](https://jimmcinerney.com/?utm_source=chatgpt.com) .
~~~~

## Answer to prompt 5

Query: Summarize Jim McInerney, La Jolla real estate agent, as a professional.

Sources returned: none in the `sources` array (empty).

Inline source chips in the text (domains only): zillow.com (+2, +1), immonetwork.net (+1). Not in the `sources` array.

Verbatim answer text:

~~~~
*   Jim McInerney — Professional Profile
    ------------------------------------
    
    Jim McInerney Real Estate Team is an established real estate operation led by Jim McInerney, a La Jolla native who specializes in residential and coastal real estate, including luxury homes, investment properties, and complex property transactions.
    
    Based on publicly available professional profiles and client testimonials, McInerney's strongest professional attributes appear to be his local market expertise, hands-on client service, marketing capabilities, and ability to manage complicated negotiations and escrows.
    
    ![](https://www.google.com/s2/favicons?domain=https://www.zillow.com&sz=32) 
    
    Zillow
    
    +2
    
    ### Professional strengths
    
    *   Deep local knowledge: His long-standing connection to La Jolla is an advantage in understanding neighborhood characteristics, property values, comparable sales, and coastal real estate.
        
    *   Pricing and negotiation: Client testimonials describe careful comparative-market analysis, thoughtful offer strategies, and an ability to work through obstacles that could otherwise jeopardize a transaction.
        
    *   Marketing and property presentation: His team emphasizes professional photography, video and drone footage, staging, and customized digital marketing to help listings stand out.
        
    *   Communication and responsiveness: Reviews frequently praise prompt responses, clear explanations, detailed follow-through, and regular updates throughout the buying or selling process.
        
    *   Transaction management: Clients and fellow real estate professionals describe the team as organized, attentive to documentation and deadlines, and effective at resolving property-condition, disclosure, and insurance issues.
        
    *   Relationship-oriented service: Testimonials portray him as personable, straightforward, and committed to protecting clients' interests rather than simply completing a sale.
        
        ![](https://www.google.com/s2/favicons?domain=https://immonetwork.net&sz=32) 
        
        immonetwork.net
        
        +1
        
    
    ### Experience and market positioning
    
    Public real estate profiles list approximately 28 years of industry experience and identify his practice as serving La Jolla and the wider coastal San Diego market. His work includes buyer and seller representation, coastal and luxury properties, second homes, and investment-related transactions. His California real estate license is listed as 01334502.
    
    ![](https://www.google.com/s2/favicons?domain=https://www.zillow.com&sz=32) 
    
    Zillow
    
    +1
    
    ### Overall professional assessment
    
    Jim McInerney appears to be a seasoned, locally knowledgeable, service-oriented real estate professional, particularly suited to clients who value personal attention, strategic pricing, polished property marketing, and experienced guidance through negotiations and closing.
    
    His public testimonials are consistently positive, including feedback from both clients and other real estate professionals. These reviews provide useful evidence of his reputation for communication and execution, although testimonials alone cannot independently establish how his results compare with those of competing agents.
    
    Bottom line: He appears particularly worth considering for a La Jolla home sale or purchase where local expertise, hands-on involvement, and careful transaction management are priorities. Before hiring him, I would compare his recent individual sales, proposed marketing plan, recommended listing price, commission structure, and results against two or three other established La Jolla agents.
~~~~
