import zohoLogo from "../assets/logos/zoho.svg";
import hubspotLogo from "../assets/logos/hubspot.png";
import salesforceLogo from "../assets/logos/salesforces.png";
import odooLogo from "../assets/logos/odoo.png";
import dynamicsLogo from "../assets/logos/dynamics.png";
import bamboohrLogo from "../assets/logos/bamboo.png";

export const software = [
  {
    id: 1,
    name: "Zoho CRM",
    logo: zohoLogo,
    category: "CRM",
    rating: 4.8,
    price: "$20/user/mo",
    views: "24,560",
    fit: "92%",
    tag: "Best Value",
  },
  {
    id: 2,
    name: "HubSpot CRM",
    logo: hubspotLogo,
    category: "CRM",
    rating: 4.7,
    price: "Free – $150/mo",
    views: "18,230",
    fit: "89%",
    tag: "Popular",
  },
  {
    id: 3,
    name: "Salesforce Sales Cloud",
    logo: salesforceLogo,
    category: "CRM",
    rating: 4.6,
    price: "$25/user/mo",
    views: "15,890",
    fit: "87%",
    tag: "Enterprise",
  },
  {
    id: 4,
    name: "Odoo ERP",
    logo: odooLogo,
    category: "ERP",
    rating: 4.5,
    price: "$24/user/mo",
    views: "13,450",
    fit: "84%",
    tag: "Flexible",
  },
  {
    id: 5,
    name: "Microsoft Dynamics 365",
    logo: dynamicsLogo,
    category: "ERP",
    rating: 4.4,
    price: "$65/user/mo",
    views: "11,230",
    fit: "81%",
    tag: "Enterprise",
  },
  {
    id: 6,
    name: "BambooHR",
    logo: bamboohrLogo,
    category: "HR",
    rating: 4.6,
    price: "$8.25/user/mo",
    views: "9,840",
    fit: "86%",
    tag: "SMB",
  },
];

export const activity = [
  ["New software submitted", "2m ago"],
  ["New review for Zoho CRM", "15m ago"],
  ["Lead assigned to partner", "32m ago"],
  ["Vendor verified", "1h ago"],
  ["New article published", "2h ago"],
  ["Commission paid", "3h ago"],
];
