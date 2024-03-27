// Fetch data from the endpoint
const os = require('os');

const getIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const interface = interfaces[interfaceName];
        for (const { address, family, internal } of interface) {
            if (family === 'IPv4' && !internal) {
                // If the address is in the format ::ffff:112.196.62.5, extract the IPv4 portion
                const ipv4Address = address.includes('::ffff:') ? address.split(':').pop() : address;
                return ipv4Address;
            }
        }
    }
};



const maschineIp=getIPAddress();

axios.get(`http://${maschineIp}:8000/url/analytics/api`)
.then(response => {
  // Extract data from the response
  const data = response.data;

  // Create HTML elements dynamically based on the data
  const analyticsDiv = document.getElementById('analytics');

  // Display total redirections
  const totalRedirectionsDiv = document.createElement('div');
  totalRedirectionsDiv.classList.add('analytics-item');
  totalRedirectionsDiv.innerHTML = `<h2>Total Redirections: <span style="color: #ff5722;">${data[0]['Total-Redirections']}</span></h3>`;
  analyticsDiv.appendChild(totalRedirectionsDiv);

  // Display analytics for each URL
  data[1]['analytics'].forEach(url => {
    const urlDiv = document.createElement('div');
    urlDiv.classList.add('analytics-item');
    urlDiv.innerHTML = `
      <h3>Short-ID URL: <a href="http://${maschineIp}:8000/${url.shortId}">http://${maschineIp}:8000/${url.shortId}</a></h3>
      <p>Clicks: <span style="color: #2196f3;">${url.Clicks}</span></p>
      <p>Visits: <span style="color: #4caf50;">${url.Visits.length}</span></p>
    `;

    // Check if there are visits and display them if available
    if (url.Visits.length > 0) {
      const visitsList = document.createElement('ul');
      visitsList.classList.add('visit-info');
      url.Visits.forEach(visit => {
        const visitItem = document.createElement('li');
        visitItem.innerHTML = `
          <span class="timestamp">Timestamp: ${visit.timestamp}</span><br>
          <span class="ip-address">IP Address: ${visit.ipAddress}</span>
        `;
        visitsList.appendChild(visitItem);
      });
      urlDiv.appendChild(visitsList);
    }

    analyticsDiv.appendChild(urlDiv);
  });
})
.catch(error => {
  console.error('Error fetching data:', error);
  const data = response.data;

  // Create HTML elements dynamically based on the data
  const analyticsDiv = document.getElementById('analytics');
  const totalRedirectionsDiv = document.createElement('div');
  totalRedirectionsDiv.classList.add('analytics-item');
  totalRedirectionsDiv.innerHTML=`Database is Empty or Server is not Running`;
  analyticsDiv.appendChild(totalRedirectionsDiv);
});