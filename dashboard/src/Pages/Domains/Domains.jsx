import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DomainManager = () => {
  const [domains, setDomains] = useState([]); // Store domains and subdomains
  const [loading, setLoading] = useState(false);

  // Form states
  const [newDomainName, setNewDomainName] = useState("");
  const [newSubdomains, setNewSubdomains] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [oldSubdomain, setOldSubdomain] = useState("");
  const [updatedSubdomain, setUpdatedSubdomain] = useState("");

  // Fetch domains from the backend
  const fetchDomains = async () => {
    setLoading(true);
    try {
      const response = await api.get("/domains");
      setDomains(response.data.domains);
    } catch (error) {
      console.error("Error fetching domains:", error);
    }
    setLoading(false);
  };
console.log(domains)
  useEffect(() => {
    fetchDomains();
  }, []);

  // Create a new domain
  const handleCreateDomain = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/domains/add", {
        name: newDomainName,
        subdomains: newSubdomains.split(",").map((sub) => sub.trim()),
      });
      alert(response.data.message);
      setNewDomainName("");
      setNewSubdomains("");
      fetchDomains();
    } catch (error) {
      console.error("Error creating domain:", error);
      alert(error.response?.data?.error || "Error creating domain");
    }
  };

  // Add subdomains to an existing domain
  const handleAddSubdomains = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/domains/add-subdomain", {
        name: selectedDomain,
        subdomains: newSubdomains.split(",").map((sub) => sub.trim()),
      });
      alert(response.data.message);
      setNewSubdomains("");
      fetchDomains();
    } catch (error) {
      console.error("Error adding subdomains:", error);
      alert(error.response?.data?.error || "Error adding subdomains");
    }
  };

  // Edit an existing subdomain
  const handleEditSubdomain = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/domains/edit-subdomain", {
        domainName: selectedDomain,
        oldSubdomain,
        newSubdomain: updatedSubdomain,
      });
      alert(response.data.message);
      // setOldSubdomain("");
      // setUpdatedSubdomain("");
      fetchDomains();
    } catch (error) {
      console.error("Error editing subdomain:", error);
      alert(error.response?.data?.error || "Error editing subdomain");
    }
  };

  // Delete a specific subdomain
  const handleDeleteSubdomain = async (domain, subdomain) => {
    try {
      const response = await api.delete("/domains/delete-subdomain", {
        data: { domainName: domain, subdomain },
      });
      alert(response.data.message);
      fetchDomains();
    } catch (error) {
      console.error("Error deleting subdomain:", error);
      alert(error.response?.data?.error || "Error deleting subdomain");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold">Domain Manager</h1>
      {loading && <p>Loading...</p>}

      {/* Create a New Domain */}
      <form
        onSubmit={handleCreateDomain}
        className="my-4 border border-gray-400 p-3 rounded-md"
      >
        <h2 className="py-2 font-semibold">Create a New Domain</h2>
        <div className="flex flex-col">
          <Input
            type="text"
            placeholder="Domain Name"
            value={newDomainName}
            onChange={(e) => setNewDomainName(e.target.value)}
            required
          />
          <textarea
            placeholder="Subdomains (comma-separated)"
            value={newSubdomains}
            className="my-2 border p-2 border-gray-300"
            onChange={(e) => setNewSubdomains(e.target.value)}
          ></textarea>
          <Button type="submit" className="w-max my-3">
            Create Domain
          </Button>
        </div>
      </form>

      <hr />

      {/* Add Subdomains */}
      <form
        onSubmit={handleAddSubdomains}
        className="my-4 border border-gray-400 p-3 rounded-md"
      >
        <h2 className="py-2 font-semibold">Add Subdomains</h2>
        <div className="flex flex-col">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="border p-2 my-2"
            required
          >
            <option value="">Select a Domain</option>
            {domains.map((domain) => (
              <option key={domain._id} value={domain.domains[0]?.name}>
                {domain.domains[0]?.name}
              </option>
            ))}
          </select>
          <textarea
            placeholder="New Subdomains (comma-separated)"
            value={newSubdomains}
            className="border p-2 my-2"
            onChange={(e) => setNewSubdomains(e.target.value)}
          ></textarea>
          <Button type="submit" className="w-max my-3">
            Add Subdomains
          </Button>
        </div>
      </form>

      <hr />

      {/* Edit Subdomain */}
      <form
  onSubmit={handleEditSubdomain}
  className="my-4 border border-gray-400 p-3 rounded-md"
>
  <h2 className="py-2 font-semibold">Edit a Subdomain</h2>
  <div className="flex flex-col">
    {/* Select a Domain */}
    <select
      value={selectedDomain}
      onChange={(e) => {
        setSelectedDomain(e.target.value);
        const domain = domains.find((d) => d.domains[0]?.name === e.target.value);
        setOldSubdomain(""); // Reset oldSubdomain when domain changes
      }}
      className="border p-2 my-2"
      required
    >
      <option value="">Select a Domain</option>
      {domains.map((domain) => (
        <option key={domain._id} value={domain.domains[0]?.name}>
          {domain.domains[0]?.name}
        </option>
      ))}
    </select>

    {/* Select an Old Subdomain */}
    <select
      value={oldSubdomain}
      onChange={(e) => setOldSubdomain(e.target.value)}
      className="border p-2 my-2"
      required
      disabled={!selectedDomain}
    >
      <option value="">Select an Old Subdomain</option>
      {domains
        .find((domain) => domain.domains[0]?.name === selectedDomain)
        ?.domains[0]?.subdomains.map((subdomain) => (
          <option key={subdomain} value={subdomain}>
            {subdomain}
          </option>
        ))}
    </select>

    {/* Updated Subdomain Input */}
    <Input
      type="text"
      placeholder="Updated Subdomain"
      value={updatedSubdomain}
      onChange={(e) => setUpdatedSubdomain(e.target.value)}
      required
    />
    <Button type="submit" className="w-max my-3">
      Edit Subdomain
    </Button>
  </div>
</form>


      <hr />

      {/* Display Domains and Subdomains */}
      <h2 className="py-2 font-semibold">Domains and Subdomains</h2>
      <div className="my-4 border border-gray-400 p-3 rounded-md">
        {domains.map((domain) => (
          <div key={domain._id} className="mb-4">
            <h3 className="font-semibold">{domain.domains[0]?.name}</h3>
            <ul className="ml-4 list-disc">
              {domain.domains[0]?.subdomains.map((subdomain) => (
                <li key={subdomain} className="flex my-1 justify-between items-center">
                  {subdomain}
                  <Button
                    variant="outline"
                    className="text-red-500 ml-2"
                    onClick={() => handleDeleteSubdomain(domain.domains[0]?.name, subdomain)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomainManager;
