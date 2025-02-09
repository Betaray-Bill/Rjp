import Domains from "../models/DomainModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const getDomains = asyncHandler(async(req, res) => {
    try{
      const domains = await Domains.find();
      return res.status(200).json({domains:domains });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})

const  initializeDomains = asyncHandler(async (req, res) => {
    try {
      const existingDoc = await Domains.findOne();
      if (!existingDoc) {
        const domains = new Domains({ domains: [] });
        await domains.save();
        res.status(201).json({ message: "Domains document initialized" });
      } else {
        res.status(200).json({ message: "Domains document already exists" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

const deleteSubdomain = async (req, res) => {
    try {
            const { domainName, subdomain } = req.body;
            console.log(req.body)

      const domainsDoc = await Domains.find();
      if (!domainsDoc) return res.status(404).json({ error: "Domains document not found" });
      // domainsDoc.domains.find((d) => d.domains[0]?.name === domainName);
      // console.log(domainsDoc)

      const domain =domainsDoc.find((d) => d.domains[0]?.name === domainName);
      console.log(domain)

      if (!domain) return res.status(404).json({ error: "Domain not found" });
  
      const subdomainIndex = domain.domains[0].subdomains.indexOf(subdomain);
      if (subdomainIndex === -1) return res.status(404).json({ error: "Subdomain not found" });
  
      domain.domains[0].subdomains=  domain.domains[0].subdomains.filter((s) => s !== subdomain);
      await domain.save();
  
      res.status(200).json({ message: "Subdomain deleted successfully", domains: domainsDoc.domains });

  
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
const editSubdomain = async (req, res) => {
    try {
      const { domainName, oldSubdomain, newSubdomain } = req.body;
        // console.log(req.body)
      const domainsDoc = await Domains.find();
      if (!domainsDoc) return res.status(404).json({ error: "Domains document not found" });
      // domainsDoc.domains.find((d) => d.domains[0]?.name === domainName);
      console.log(domainsDoc)

      const domain =domainsDoc.find((d) => d.domains[0]?.name === domainName);
      console.log(domain)

      if (!domain) return res.status(404).json({ error: "Domain not found" });
  
      const subdomainIndex = domain.domains[0].subdomains.indexOf(oldSubdomain);
      if (subdomainIndex === -1) return res.status(404).json({ error: "Subdomain not found" });
  
      domain.domains[0].subdomains[subdomainIndex] = newSubdomain;
      await domain.save();
  
      res.status(200).json({ message: "Subdomain updated successfully", domains: domainsDoc.domains });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const addSubdomain = async (req, res) => {
    try {
      const { name, subdomains } = req.body;
  
      const domainsDoc = await Domains.find();
      console.log(domainsDoc[0].domains[0].name)
      if (!domainsDoc) return res.status(404).json({ error: "Domains document not found" });
  
      const domain = domainsDoc.find((d) => d.domains[0].name === name);
      if (!domain) return res.status(404).json({ error: "Domain not found" });
      console.log("domainsss:, ", domain)
      domain.domains[0].subdomains.push(...subdomains);
      await domain.save();
  
      res.status(200).json({ message: "Subdomains added successfully", domains: domainsDoc.domains });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

const addDomain = async (req, res) => {
    try {
      const { name, subdomains } = req.body;
        console.log(req.body)
      const domainsDoc = new Domains();
    //   if (!domainsDoc) return res.status(404).json({ error: "Domains document not found" });
  
    //   // Check for duplicate domain name
    //   if (domainsDoc.domains.some((d) => d.name === name)) {
    //     return res.status(400).json({ error: "Domain already exists" });
    //   }
      console.log(1)
  
      domainsDoc.domains.push({ name, subdomains });
      await domainsDoc.save();
  
      return res.status(201).json({ message: "Domain added successfully", domains: domainsDoc.domains });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  


  export{
    initializeDomains,
    getDomains,
    deleteSubdomain,
    editSubdomain,
    addSubdomain,
    addDomain
  }