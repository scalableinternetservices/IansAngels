FROM ruby:3.0

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -y nodejs yarn --no-install-recommends \
    && gem install rails

WORKDIR /app

COPY Gemfile Gemfile.lock /app/
RUN bundle install

ARG RAILS_MASTER_KEY
RUN RAILS_MASTER_KEY=${RAILS_MASTER_KEY} RAILS_ENV=production bundle exec rails assets:precompile

CMD ["/bin/bash"]
