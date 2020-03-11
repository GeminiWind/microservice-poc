ARG ELK_VERSION

# https://github.com/elastic/logstash-docker
FROM docker.elastic.co/logstash/logstash:${ELK_VERSION}

RUN logstash-plugin install logstash-input-log4j

# Add your logstash plugins setup here
# Example: RUN logstash-plugin install logstash-filter-json
