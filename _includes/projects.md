<h2 id="Projects" style="margin: 2px 0px -15px;">Projects</h2>

<div class="publications">
  <ol class="bibliography">

    {% for link in site.data.projects.main %}

    <li>
      <div class="pub-row">
        <!-- 项目图片和缩略图 -->
        <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
          {% if link.image %}
          <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width: 350px; height: 100%;">
          {% endif %}
        </div>

        <!-- 项目信息 -->
        <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
          <!-- 项目标题 -->
          <div class="title">
            <a href="{{ link.pdf }}">{{ link.title }}</a>
          </div>

          <!-- 作者部分 -->
          <div class="author">
            {% assign team_leader = false %}
            {% assign joint_author = false %}
            
            {% for author in link.authors %}
              {% if author.url %}
                <a href="{{ author.url }}" target="_blank">{{ author.name }}</a>
              {% else %}
                {{ author.name }}
              {% endif %}

              {% if author.mark %}
                {{ author.mark }}
              {% endif %}
              
              {% if forloop.last == false %}, {% endif %}
              
              <!-- 检查是否是Team Leader或Joint Author -->
              {% if author.role == "Team Leader" %}
                {% assign team_leader = true %}
              {% endif %}
              {% if author.role == "Joint Author" %}
                {% assign joint_author = true %}
              {% endif %}
            {% endfor %}
            
            <!-- 显示Team Leader和Joint Author标记 -->
            {% if team_leader %}
              <strong> (†Team Leader)</strong>
            {% endif %}
            {% if joint_author %}
              <strong> (*Joint Author)</strong>
            {% endif %}
          </div>

          <!-- 会议信息 -->
          <div class="periodical">
            <em>{{ link.conference }}</em>
          </div>

          <!-- 时间 -->
          {% if link.time %}
          <div class="time" style="margin-top: 5px;">
            <strong>Time:</strong> {{ link.time }}
          </div>
          {% endif %}

          <!-- 比赛信息 -->
          {% if link.competition %}
          <div class="competition" style="margin-top: 5px;">
            <strong>Competition:</strong> {{ link.competition }}
          </div>
          {% endif %}

          <!-- 奖项信息 -->
          {% if link.award %}
          <div class="award" style="margin-top: 5px;">
            <strong>Award:</strong> {{ link.award }}
          </div>
          {% endif %}

          <!-- 概述 -->
          {% if link.overview %}
          <div class="overview" style="margin-top: 5px;">
            <strong>Overview:</strong> {{ link.overview }}
          </div>
          {% endif %}

          <!-- 专利链接 -->
          {% if link.patent %}
          <a href="{{ link.patent }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Patent</a>
          {% endif %}

          <!-- 其他相关链接 -->
          <div class="links">
            {% if link.code %}
            <a href="{{ link.code }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Code</a>
            {% endif %}
            {% if link.page %}
            <a href="{{ link.page }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Project Page</a>
            {% endif %}
            {% if link.bibtex %}
            <a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">BibTex</a>
            {% endif %}

            <!-- Website 和 Github 链接 -->
            {% if link.links.website %}
            <a href="{{ link.links.website }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Website</a>
            {% endif %}
            {% if link.links.github %}
            <a href="{{ link.links.github }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Github</a>
            {% endif %}

            <!-- Notes 部分，支持多行显示 -->
            {% if link.notes %}
            <div class="notes" style="margin-top: 5px;">
              {% for note in link.notes %}
              <strong> <i style="color:#e74d3c">{{ note }}</i></strong><br>
              {% endfor %}
            </div>
            {% endif %}

            <!-- 其他信息 -->
            {% if link.others %}
            {{ link.others }}
            {% endif %}
          </div>
        </div>
      </div>
    </li>

    <br>

    {% endfor %}

  </ol>
</div>
