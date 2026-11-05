export function initSkills() {
  const row1Skills = [
    'Java',
    'Spring Boot',
    'Spring MVC',
    'Spring Security',
    'Hibernate',
    'JPA',
    'REST APIs',
    'Spring Cloud Gateway',
    'Eureka',
    'Spring Cloud Config',
    'Transactional Outbox',
    'Resilience4j',
    'RabbitMQ',
    'Angular',
    'HTML5',
    'CSS3',
    'SCSS',
    'JavaScript',
    'jQuery',
    'Bootstrap',
    'MySQL',
    'PostgreSQL',
    'Oracle',
    'Flyway',
    'Redis',
    'JWT',
    'OAuth 2.0',
    'OpenID Connect',
    'JUnit 5',
    'Mockito',
    'Selenium',
    'SonarQube'
  ];

  const row2Skills = [
    'WildFly',
    'Tomcat',
    'Maven',
    'SVN',
    'Git',
    'IBM RTC',
    'Docker',
    'Jenkins',
    'CI/CD',
    'Spring Boot Actuator',
    'Prometheus',
    'Grafana',
    'Spring AI',
    'Retrieval-Augmented Generation (RAG)',
    'Ollama',
    'MCP',
    'PGVector',
    'Servlets',
    'Struts 2',
    'JSP',
    'JSTL',
    'JBoss',
    'iReports',
    'Jira',
    'Bugzilla',
    'IBM Rhapsody',
    'Postman',
    'ChatGPT',
    'Cursor',
    'Claude'
  ];

  function buildChips(skills) {
    return skills
      .map((skill) => {
        return `
          <span class="skill-chip">
            <span class="chip-dot"></span>
            ${skill}
          </span>
        `;
      })
      .join('');
  }

  const row1 = document.getElementById('marquee-row-1');
  const row2 = document.getElementById('marquee-row-2');

  if (row1) {
    const html = buildChips(row1Skills);
    row1.innerHTML = html + html;
  }

  if (row2) {
    const html = buildChips(row2Skills);
    row2.innerHTML = html + html;
  }
}